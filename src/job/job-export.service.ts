import { Inject, Injectable, NotFoundException, Logger } from "@nestjs/common";
import {
  JOB_DAO,
  APPLICATION_DAO,
  PROGRAM_DAO,
  ON_CAMPUS_OFFER_DAO,
} from "src/constants";
import {
  JobModel,
  CompanyModel,
  RecruiterModel,
  UserModel,
  JobCoordinatorModel,
  TpcMemberModel,
  StudentModel,
  ProgramModel,
  EventModel,
  SalaryModel,
  SeasonModel,
  ApplicationModel,
  ResumeModel,
  OnCampusOfferModel,
} from "src/db/models";
import { EmailService, SendEmailDto } from "src/services/EmailService";
import { execFile } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

@Injectable()
export class JobExportService {
  private logger = new Logger(JobExportService.name);

  constructor(
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(APPLICATION_DAO) private applicationRepo: typeof ApplicationModel,
    @Inject(PROGRAM_DAO) private programRepo: typeof ProgramModel,
    @Inject(ON_CAMPUS_OFFER_DAO) private offerRepo: typeof OnCampusOfferModel,
    private emailService: EmailService
  ) {}

  async fetchJobCompleteDetails(jobId: string) {
    const job = await this.jobRepo.findByPk(jobId, {
      include: [
        { model: SeasonModel, as: "season" },
        { model: CompanyModel, as: "company" },
        {
          model: RecruiterModel,
          as: "recruiter",
          include: [{ model: UserModel, as: "user" }],
        },
        {
          model: JobCoordinatorModel,
          as: "jobCoordinators",
          include: [
            {
              model: TpcMemberModel,
              as: "tpcMember",
              include: [
                {
                  model: StudentModel,
                  as: "student",
                  include: [
                    { model: UserModel, as: "user" },
                    { model: ProgramModel, as: "program" },
                  ],
                },
              ],
            },
          ],
        },
        { model: EventModel, as: "events" },
        { model: SalaryModel, as: "salaries" },
      ],
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    const plainJob = job.get({ plain: true });

    // Fetch Program Map for Salaries
    const allPrograms = await this.programRepo.findAll();
    const programMap = allPrograms.reduce((acc, p) => {
      acc[p.id] = p.get({ plain: true });
      return acc;
    }, {});

    const enrichedSalaries = (plainJob.salaries || []).map((sal: any) => ({
      ...sal,
      programsDetails: (sal.programs || []).map((progId: string) => programMap[progId]).filter(Boolean),
    }));

    // Fetch Applications with Student, User, Program, Event, Resume
    const applications = await this.applicationRepo.findAll({
      where: { jobId },
      include: [
        {
          model: StudentModel,
          as: "student",
          include: [
            { model: UserModel, as: "user" },
            { model: ProgramModel, as: "program" },
          ],
        },
        { model: EventModel, as: "event" },
        { model: ResumeModel, as: "resume" },
      ],
    });
    const plainApplications = applications.map((app) => app.get({ plain: true }));

    // Fetch Offers for all salaries of this job
    const salaryIds = (plainJob.salaries || []).map((s: any) => s.id);
    let offers: any[] = [];
    if (salaryIds.length > 0) {
      const offerRecords = await this.offerRepo.findAll({
        where: { salaryId: salaryIds },
        include: [
          {
            model: StudentModel,
            as: "student",
            include: [
              { model: UserModel, as: "user" },
              { model: ProgramModel, as: "program" },
            ],
          },
          { model: SalaryModel, as: "salary" },
        ],
      });
      offers = offerRecords.map((o) => o.get({ plain: true }));
    }

    return {
      job: plainJob,
      salaries: enrichedSalaries,
      applications: plainApplications,
      offers,
    };
  }

  // --- CSV GENERATION ---
  generateSingleCsv(data: any): string {
    const lines: string[] = [];

    const escapeCsv = (val: any): string => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const addRow = (cols: any[]) => {
      lines.push(cols.map(escapeCsv).join(","));
    };

    const addSectionHeader = (title: string) => {
      lines.push("");
      lines.push(`=== ${title.toUpperCase()} ===`);
    };

    const { job, salaries, applications, offers } = data;

    // 1. JOB DETAILS
    addSectionHeader("Job Details");
    addRow(["Property", "Value"]);
    addRow(["Job ID", job.id]);
    addRow(["Role", job.role]);
    addRow(["Company Name", job.company?.name || "N/A"]);
    addRow(["Company Category", job.company?.category || "N/A"]);
    addRow(["Company Website", job.company?.website || "N/A"]);
    addRow(["Season", job.season ? `${job.season.type} ${job.season.year}` : "N/A"]);
    addRow(["Location", job.location || "N/A"]);
    addRow(["Duration", job.duration || "N/A"]);
    addRow(["Active Status", job.active ? "Active" : "Inactive"]);
    addRow(["Registration Status", job.registration || "N/A"]);
    addRow(["Current Status", job.currentStatus || "N/A"]);
    addRow(["Offer Letter Release Date", job.offerLetterReleaseDate || "N/A"]);
    addRow(["Joining Date", job.joiningDate || "N/A"]);
    addRow(["Min No Of Hires", job.minNoOfHires ?? "N/A"]);
    addRow(["Expected No Of Hires", job.expectedNoOfHires ?? "N/A"]);
    addRow(["Skills", (job.skills || []).join(", ")]);
    addRow(["Attachments", (job.attachments || []).join(", ")]);
    addRow([
      "Description",
      (job.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    ]);

    // 2. SALARY DETAILS
    addSectionHeader("Salary Details");
    addRow([
      "Salary ID",
      "Salary Period",
      "Total CTC",
      "Base Salary",
      "Stipend",
      "Eligible Programs",
    ]);
    if (salaries.length === 0) {
      addRow(["No salary details specified", "-", "-", "-", "-", "-"]);
    } else {
      salaries.forEach((s: any) => {
        const progNames = (s.programsDetails || [])
          .map((p: any) => `${p.course} ${p.department} (${p.branch})`)
          .join("; ");
        addRow([
          s.id,
          s.salaryPeriod || "N/A",
          s.totalCTC ?? "N/A",
          s.baseSalary ?? "N/A",
          s.stipend ?? "N/A",
          progNames || "All/None Specified",
        ]);
      });
    }

    // 3. RECRUITER DETAILS
    addSectionHeader("Recruiter Details");
    addRow(["Name", "Designation", "Email", "Contact", "Landline", "Company"]);
    const recruiters = job.recruiterDetailsFilled && job.recruiterDetailsFilled.length > 0
      ? job.recruiterDetailsFilled
      : (job.recruiter ? [{
          name: job.recruiter.user?.name,
          email: job.recruiter.user?.email,
          contact: job.recruiter.user?.contact,
          designation: job.recruiter.designation,
          landline: job.recruiter.landline,
        }] : []);

    if (recruiters.length === 0) {
      addRow(["No recruiter details specified", "-", "-", "-", "-", job.company?.name || "N/A"]);
    } else {
      recruiters.forEach((r: any) => {
        addRow([
          r.name || "N/A",
          r.designation || "N/A",
          r.email || "N/A",
          r.contact || "N/A",
          r.landline || "N/A",
          job.company?.name || "N/A",
        ]);
      });
    }

    // 4. JOB COORDINATORS
    addSectionHeader("Job Coordinators");
    addRow(["Name", "Roll No", "Role", "Department", "Course", "Email", "Contact"]);
    const coordinators = job.jobCoordinators || [];
    if (coordinators.length === 0) {
      addRow(["No coordinators assigned", "-", "-", "-", "-", "-", "-"]);
    } else {
      coordinators.forEach((jc: any) => {
        const student = jc.tpcMember?.student;
        const user = student?.user;
        const prog = student?.program;
        addRow([
          user?.name || "N/A",
          student?.rollNo || "N/A",
          jc.tpcMember?.role || "N/A",
          prog?.department || "N/A",
          prog?.course || "N/A",
          user?.email || "N/A",
          user?.contact || "N/A",
        ]);
      });
    }

    // 5. EVENTS DETAILS
    addSectionHeader("Events Details");
    addRow(["Event ID", "Title / Type", "Round Number", "Start Time", "End Time", "Venue"]);
    const events = job.events || [];
    if (events.length === 0) {
      addRow(["No events scheduled", "-", "-", "-", "-", "-"]);
    } else {
      events.forEach((e: any) => {
        addRow([
          e.id,
          e.type || e.title || "N/A",
          e.roundNumber ?? "N/A",
          e.startDateTime ? new Date(e.startDateTime).toLocaleString() : "N/A",
          e.endDateTime ? new Date(e.endDateTime).toLocaleString() : "N/A",
          e.venue || "N/A",
        ]);
      });
    }

    // 6. APPLICATIONS & STUDENTS APPLIED
    addSectionHeader("Applications & Students Applied");
    addRow([
      "Application ID",
      "Roll No",
      "Student Name",
      "Email",
      "Contact",
      "Department",
      "Course",
      "Branch",
      "CPI",
      "Applied Date",
      "Current Event / Round",
    ]);
    if (applications.length === 0) {
      addRow(["No applications received", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]);
    } else {
      applications.forEach((app: any) => {
        const student = app.student;
        const user = student?.user;
        const prog = student?.program;
        const event = app.event;
        addRow([
          app.id,
          student?.rollNo || "N/A",
          user?.name || "N/A",
          user?.email || "N/A",
          user?.contact || "N/A",
          prog?.department || "N/A",
          prog?.course || "N/A",
          prog?.branch || "N/A",
          student?.cpi ?? "N/A",
          app.createdAt ? new Date(app.createdAt).toLocaleString() : "N/A",
          event ? `${event.type} (Round ${event.roundNumber})` : "Initial",
        ]);
      });
    }

    // 7. OFFERS
    addSectionHeader("Offers");
    addRow([
      "Offer ID",
      "Roll No",
      "Student Name",
      "Email",
      "Department",
      "Course",
      "Salary Period",
      "Total CTC",
      "Offer Status",
      "Offer Date",
    ]);
    if (offers.length === 0) {
      addRow(["No offers made yet", "-", "-", "-", "-", "-", "-", "-", "-", "-"]);
    } else {
      offers.forEach((off: any) => {
        const student = off.student;
        const user = student?.user;
        const prog = student?.program;
        const sal = off.salary;
        addRow([
          off.id,
          student?.rollNo || "N/A",
          user?.name || "N/A",
          user?.email || "N/A",
          prog?.department || "N/A",
          prog?.course || "N/A",
          sal?.salaryPeriod || "N/A",
          sal?.totalCTC ?? "N/A",
          off.status || "N/A",
          off.createdAt ? new Date(off.createdAt).toLocaleString() : "N/A",
        ]);
      });
    }

    return lines.join("\n");
  }

  // --- LATEX PDF GENERATION ---
  private escapeLatex(text: any): string {
    if (text === null || text === undefined) return "";
    let str = String(text);
    // Strip HTML tags
    str = str.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    // Escape LaTeX special characters
    return str
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\\$")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}");
  }

  async generateLatexPdf(data: any): Promise<Buffer> {
    const { job, salaries, applications, offers } = data;

    const recruiters = job.recruiterDetailsFilled && job.recruiterDetailsFilled.length > 0
      ? job.recruiterDetailsFilled
      : (job.recruiter ? [{
          name: job.recruiter.user?.name,
          email: job.recruiter.user?.email,
          contact: job.recruiter.user?.contact,
          designation: job.recruiter.designation,
          landline: job.recruiter.landline,
        }] : []);

    const coordinators = job.jobCoordinators || [];
    const events = job.events || [];

    const texContent = `
\\documentclass[10pt,a4paper]{article}
\\usepackage[utf8]{utf8}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{booktabs}
\\usepackage{tabularx}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{fancyhdr}

\\definecolor{primary}{RGB}{37, 99, 235}
\\definecolor{darkgray}{RGB}{55, 65, 81}
\\definecolor{lightgray}{RGB}{243, 244, 246}

\\titleformat{\\section}{\\large\\bfseries\\color{primary}}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{12pt}{6pt}

\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\textcolor{darkgray}{Job Details Report - ${this.escapeLatex(job.company?.name || "Company")} (${this.escapeLatex(job.role)})}}
\\lfoot{\\textcolor{darkgray}{Confidential - Admin Access Only}}
\\rfoot{\\thepage}

\\begin{document}

\\begin{center}
{\\huge \\bfseries \\color{primary} ${this.escapeLatex(job.company?.name || "Company")}}\\\\[4pt]
{\\Large \\bfseries ${this.escapeLatex(job.role)}}\\\\[4pt]
{\\small \\color{darkgray} Season: ${this.escapeLatex(job.season ? `${job.season.type} ${job.season.year}` : "N/A")} \\quad | \\quad Status: ${this.escapeLatex(job.currentStatus || "N/A")} \\quad | \\quad Location: ${this.escapeLatex(job.location || "N/A")}}
\\end{center}

\\vspace{8pt}

\\section*{1. Job Details}
\\begin{tabularx}{\\textwidth}{>{\\bfseries\\color{darkgray}}l X}
Role & ${this.escapeLatex(job.role)} \\\\
Company & ${this.escapeLatex(job.company?.name)} (${this.escapeLatex(job.company?.category || "N/A")}) \\\\
Location & ${this.escapeLatex(job.location || "N/A")} \\\\
Duration & ${this.escapeLatex(job.duration || "N/A")} \\\\
Registration Status & ${this.escapeLatex(job.registration || "N/A")} \\\\
Current Status & ${this.escapeLatex(job.currentStatus || "N/A")} \\\\
Joining Date & ${this.escapeLatex(job.joiningDate || "Not Specified")} \\\\
Skills Required & ${this.escapeLatex((job.skills || []).join(", ") || "None Specified")} \\\\
Description & ${this.escapeLatex(job.description)} \\\\
\\end{tabularx}

\\section*{2. Salary Details}
\\begin{tabularx}{\\textwidth}{X r r r X}
\\toprule
\\textbf{Period} & \\textbf{Total CTC} & \\textbf{Base Salary} & \\textbf{Stipend} & \\textbf{Eligible Programs} \\\\
\\midrule
${salaries.length === 0 ? `No salary info & - & - & - & - \\\\` : salaries.map((s: any) => {
  const progs = (s.programsDetails || []).map((p: any) => `${p.course} ${p.department}`).join(", ") || "All";
  return `${this.escapeLatex(s.salaryPeriod || "N/A")} & ${this.escapeLatex(s.totalCTC ?? "N/A")} & ${this.escapeLatex(s.baseSalary ?? "N/A")} & ${this.escapeLatex(s.stipend ?? "N/A")} & ${this.escapeLatex(progs)} \\\\`;
}).join("\n")}
\\bottomrule
\\end{tabularx}

\\section*{3. Recruiter Details}
\\begin{tabularx}{\\textwidth}{X X X X}
\\toprule
\\textbf{Name} & \\textbf{Designation} & \\textbf{Email} & \\textbf{Contact} \\\\
\\midrule
${recruiters.length === 0 ? `No recruiters listed & - & - & - \\\\` : recruiters.map((r: any) => {
  return `${this.escapeLatex(r.name || "N/A")} & ${this.escapeLatex(r.designation || "N/A")} & ${this.escapeLatex(r.email || "N/A")} & ${this.escapeLatex(r.contact || "N/A")} \\\\`;
}).join("\n")}
\\bottomrule
\\end{tabularx}

\\section*{4. Job Coordinators}
\\begin{tabularx}{\\textwidth}{X X X X X}
\\toprule
\\textbf{Name} & \\textbf{Roll No} & \\textbf{Role} & \\textbf{Department} & \\textbf{Email} \\\\
\\midrule
${coordinators.length === 0 ? `No coordinators & - & - & - & - \\\\` : coordinators.map((jc: any) => {
  const st = jc.tpcMember?.student;
  const u = st?.user;
  const p = st?.program;
  return `${this.escapeLatex(u?.name || "N/A")} & ${this.escapeLatex(st?.rollNo || "N/A")} & ${this.escapeLatex(jc.tpcMember?.role || "N/A")} & ${this.escapeLatex(p?.department || "N/A")} & ${this.escapeLatex(u?.email || "N/A")} \\\\`;
}).join("\n")}
\\bottomrule
\\end{tabularx}

\\section*{5. Scheduled Events}
\\begin{tabularx}{\\textwidth}{l X c X}
\\toprule
\\textbf{Round} & \\textbf{Event Type} & \\textbf{Start Time} & \\textbf{Venue} \\\\
\\midrule
${events.length === 0 ? `No events scheduled & - & - & - \\\\` : events.map((e: any) => {
  const stTime = e.startDateTime ? new Date(e.startDateTime).toLocaleString() : "N/A";
  return `${this.escapeLatex(e.roundNumber ?? 0)} & ${this.escapeLatex(e.type || e.title || "N/A")} & ${this.escapeLatex(stTime)} & ${this.escapeLatex(e.venue || "N/A")} \\\\`;
}).join("\n")}
\\bottomrule
\\end{tabularx}

\\section*{6. Applications (${applications.length} Total)}
\\begin{tabularx}{\\textwidth}{l X X l c}
\\toprule
\\textbf{Roll No} & \\textbf{Name} & \\textbf{Department} & \\textbf{CPI} & \\textbf{Current Round} \\\\
\\midrule
${applications.length === 0 ? `No applications & - & - & - & - \\\\` : applications.slice(0, 100).map((app: any) => {
  const st = app.student;
  const u = st?.user;
  const p = st?.program;
  const ev = app.event;
  return `${this.escapeLatex(st?.rollNo || "N/A")} & ${this.escapeLatex(u?.name || "N/A")} & ${this.escapeLatex(p?.department || "N/A")} & ${this.escapeLatex(st?.cpi ?? "N/A")} & ${this.escapeLatex(ev ? `R${ev.roundNumber}` : "Submitted")} \\\\`;
}).join("\n")}
\\bottomrule
\\end{tabularx}
${applications.length > 100 ? `\\textit{* Showing first 100 applications of ${applications.length} total.}` : ""}

\\section*{7. Offers (${offers.length} Total)}
\\begin{tabularx}{\\textwidth}{l X X r c}
\\toprule
\\textbf{Roll No} & \\textbf{Name} & \\textbf{Department} & \\textbf{CTC} & \\textbf{Status} \\\\
\\midrule
${offers.length === 0 ? `No offers made & - & - & - & - \\\\` : offers.map((off: any) => {
  const st = off.student;
  const u = st?.user;
  const p = st?.program;
  const sal = off.salary;
  return `${this.escapeLatex(st?.rollNo || "N/A")} & ${this.escapeLatex(u?.name || "N/A")} & ${this.escapeLatex(p?.department || "N/A")} & ${this.escapeLatex(sal?.totalCTC ?? "N/A")} & ${this.escapeLatex(off.status || "N/A")} \\\\`;
}).join("\n")}
\\bottomrule
\\end{tabularx}

\\end{document}
`;

    // Execute pdflatex in temporary directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "job-pdf-"));
    const texPath = path.join(tempDir, "document.tex");
    const pdfPath = path.join(tempDir, "document.pdf");

    try {
      fs.writeFileSync(texPath, texContent, "utf8");
      await execFileAsync("pdflatex", ["-interaction=nonstopmode", "document.tex"], {
        cwd: tempDir,
      });

      if (!fs.existsSync(pdfPath)) {
        throw new Error("LaTeX compilation failed to produce output PDF file.");
      }

      const pdfBuffer = fs.readFileSync(pdfPath);
      return pdfBuffer;
    } catch (err) {
      this.logger.error("pdflatex compilation error:", err);
      throw new Error(`Failed to compile LaTeX PDF document: ${err.message || err}`);
    } finally {
      // Clean up temp files safely
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (_e) {
        // ignore cleanup error
      }
    }
  }

  // --- EMAIL DELIVERY ---
  async sendExportEmail(
    userEmail: string,
    jobData: any,
    format: "csv" | "pdf",
    buffer: Buffer,
    filename: string
  ) {
    const jobName = `${jobData.job?.company?.name || "Company"} - ${jobData.job?.role || "Job"}`;
    const contentType = format === "pdf" ? "application/pdf" : "text/csv";

    const dto: SendEmailDto = {
      recepients: [{ address: userEmail }],
      subject: `[TPC Portal] Complete Job Details: ${jobName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">TPC Job Details Export</h2>
          <p>Hello Admin,</p>
          <p>Please find attached the exported details for <strong>${jobName}</strong> in <strong>${format.toUpperCase()}</strong> format.</p>
          <p style="font-size: 12px; color: #666;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      `,
      attachments: [
        {
          filename,
          content: buffer,
          contentType,
        },
      ],
    };

    return await this.emailService.sendEmail(dto);
  }
}
