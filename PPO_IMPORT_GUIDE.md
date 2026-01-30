# PPO Data Import Guide

## Overview
This guide explains how to import PPO (Pre-Placement Offer) data into the TPC system as offers, based on the existing codebase architecture.

## Current Architecture Understanding

### Database Models
1. **OnCampusOfferModel** - For offers from on-campus placements
   - Links: Student → Salary → Job → Company
   - Fields: `studentId`, `salaryId`, `status`, `metadata`

2. **OffCampusOfferModel** - For offers from off-campus/external sources
   - Direct links: Student → Company → Season
   - Fields: `studentId`, `seasonId`, `companyId`, `salary`, `salaryPeriod`, `role`, `status`, `metadata`

3. **JobModel** - Represents a job posting
   - Links to Company, Recruiter, Season
   - Fields: `role`, `location`, `active`, `currentStatus`, `registration`

4. **SalaryModel** - Salary details for a job
   - Links to Job
   - Fields: `totalCTC`, `stipend`, `salaryPeriod`, `others`, eligibility criteria (programs, genders, categories, etc.)

5. **CompanyModel** - Company information
   - Fields: `name`, `category`, `yearOfEstablishment`

### Dashboard Integration
The Analytics Dashboard uses **OnCampusOfferModel** to display placement statistics:
- Total registered students
- Placed students count
- Placement percentage
- Total offers
- Total companies offering
- Package statistics (highest, lowest, mean, median, mode)

**Important**: Currently, only OnCampusOffers are shown in the dashboard!

## PPO Data Analysis

### Current CSV Structure
```
S NO, Name, Official Email, Department, Gender, Date of Birth, email, Birth Category, 
Contact No., Internship Company, Stipend p/m, Others (for accomodation etc), PPO- CTC, 
Offer rcd date, FTE-Company Name Final offer (including PPO), Job Title, 1st year CTC, 
Overall CTC
```

### Key Observations
1. **PPO offers** are conversions from internships → full-time positions
2. Students have both:
   - **Internship data**: Company, Stipend, Others (accommodation)
   - **PPO data**: CTC, Offer received date, Final company name, Job title
3. **Final offer** may be the same company (PPO accepted) or different (PPO rejected, chose another offer)

## Recommended Approach

### Option 1: Import as OnCampusOffers (RECOMMENDED for Dashboard Visibility)

This approach creates proper Job → Salary → OnCampusOffer chain, ensuring PPO data appears in the analytics dashboard.

#### Steps:
1. **Create or Find Company**
2. **Create Dummy Recruiter** (if needed)
3. **Create Job** for the PPO role
4. **Create Salary** record with CTC details
5. **Create OnCampusOffer** linking student to salary

#### Pros:
- ✅ **Appears in analytics dashboard**
- ✅ Maintains referential integrity
- ✅ Supports all salary eligibility criteria
- ✅ Can track job status and recruitment process

#### Cons:
- Requires creating Job and Recruiter records
- More complex data structure

### Option 2: Import as OffCampusOffers (Simpler but Limited)

Direct student → company → season linkage without job/salary intermediary.

#### Pros:
- ✅ Simpler data structure
- ✅ Direct mapping from CSV
- ✅ No need for recruiter/job records

#### Cons:
- ❌ **NOT visible in analytics dashboard** (dashboard only uses OnCampusOffers)
- Limited to basic salary info
- No job status tracking

## Detailed Implementation: OnCampusOffer Approach

### Enhanced CSV Format (Recommended)

Add these columns to your CSV for better data quality:

```csv
S NO, Name, Official Email, Roll Number, Department, Program Year, Course, Gender, 
Date of Birth, Personal Email, Birth Category, Contact No., 
Internship Company, Stipend p/m, Intern Others, Intern Start Date, Intern End Date,
PPO CTC (Lakhs), PPO Offer Date, PPO Role, 
Final Company, Final Role, Final 1st Year CTC (Lakhs), Final Overall CTC (Lakhs), 
Offer Status, Season ID
```

### Required IDs/Fields to Add:
1. **Season ID** - Which placement season this belongs to (required)
2. **Roll Number** - To find existing students
3. **Program Year** - e.g., "3" for Third Year
4. **Course** - BTECH, MTECH, MS, etc.
5. **Offer Status** - ACCEPTED, REJECTED, ONGOING
6. **PPO CTC in Lakhs** - Convert to actual value (multiply by 100,000)

### Implementation Code

Create a new service method in `DataService.ts`:

```typescript
interface IPPORowType {
  sNo: number;
  name: string;
  officialEmail: string;
  rollNumber: string;
  department: string;
  programYear: string;
  course: CourseEnum;
  gender: string;
  dateOfBirth: string;
  personalEmail: string;
  category: string;
  contactNo: string;
  
  // Internship data
  internshipCompany: string;
  stipendPerMonth: number;
  internOthers: number;
  internStartDate?: string;
  internEndDate?: string;
  
  // PPO data
  ppoCtcLakhs: number;
  ppoOfferDate: string;
  ppoRole: string;
  
  // Final offer data
  finalCompany: string;
  finalRole: string;
  final1stYearCtcLakhs: number;
  finalOverallCtcLakhs: number;
  
  offerStatus: OfferStatusEnum;
  seasonId: string;
}

async uploadPPOFromExcel(filePath: string, seasonId: string) {
  // 1. Read and parse Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data: IPPORowType[] = XLSX.utils.sheet_to_json(sheet);
  
  console.log(`Processing ${data.length} PPO records...`);
  
  for (const row of data) {
    try {
      // 2. Find or create student
      let student = await this.studentRepo.findOne({
        where: { rollNo: row.rollNumber },
        include: [{ model: UserModel, as: 'user' }]
      });
      
      if (!student) {
        // Create student if not exists
        student = await this.CreateStudent({
          name: row.name,
          officialEmail: row.officialEmail,
          rollNumber: row.rollNumber,
          category: row.category,
          department: row.department,
          gender: row.gender,
          contactNo: row.contactNo,
          aggregateCPI: 0, // Set appropriately
        }, seasonId);
      }
      
      // 3. Create/Find Company for final offer
      const [company] = await this.companyRepo.findOrCreate({
        where: { name: row.finalCompany },
        defaults: {
          category: CompanyCategoryEnum.MNC,
          yearOfEstablishment: new Date().getFullYear().toString(),
        }
      });
      
      // 4. Create dummy recruiter for this company
      const recruiterUser = await this.userRepo.create({
        name: `${row.finalCompany} Recruiter`,
        email: `recruiter.${row.finalCompany.toLowerCase().replace(/\s/g, '')}@example.com`,
        contact: '0000000000',
        role: RoleEnum.RECRUITER,
      });
      
      const recruiter = await this.recruiterRepo.create({
        userId: recruiterUser.id,
        companyId: company.id,
        designation: 'Placement Coordinator',
      });
      
      // 5. Create Job for PPO
      const job = await this.jobRepo.create({
        seasonId: seasonId,
        companyId: company.id,
        recruiterId: recruiter.id,
        role: row.finalRole || row.ppoRole || 'Not Specified',
        location: 'India', // Default, can be enhanced
        active: false, // PPO process is complete
        currentStatus: JobStatusTypeEnum.RECRUITMENT_PROCESS_COMPLELETED,
        registration: JobRegistrationEnum.CLOSED,
      });
      
      // 6. Create Salary record
      const salary = await this.salaryRepo.create({
        jobId: job.id,
        totalCTC: Math.floor(row.finalOverallCtcLakhs * 100000), // Convert lakhs to rupees
        baseSalary: Math.floor(row.final1stYearCtcLakhs * 100000),
        salaryPeriod: 'PER_ANNUM',
        others: row.internOthers ? row.internOthers.toString() : undefined,
      });
      
      // 7. Create OnCampusOffer (this makes it visible in dashboard!)
      const offer = await this.onCampusOfferRepo.create({
        studentId: student.id,
        salaryId: salary.id,
        status: row.offerStatus || OfferStatusEnum.ACCEPTED,
        metadata: JSON.stringify({
          ppoFromCompany: row.internshipCompany,
          ppoOfferDate: row.ppoOfferDate,
          internStipend: row.stipendPerMonth,
          internOthers: row.internOthers,
          source: 'PPO_IMPORT',
          importDate: new Date().toISOString(),
        }),
      });
      
      console.log(`✅ Created PPO offer for ${row.name} (${row.rollNumber}) - ${row.finalCompany}`);
      
    } catch (error) {
      console.error(`❌ Failed to process row ${row.sNo}:`, error);
      // Continue with next record
    }
  }
  
  console.log('PPO data upload complete!');
}
```

### Usage

Add to `upload-data.ts`:

```typescript
async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(DataCliModule);
  const service = appContext.get(DataUploadService);

  const [, , command, filePath, ...args] = process.argv;

  if (command === 'ppo') {
    const [seasonId] = args;
    if (!filePath || !seasonId) {
      console.error("❌ Usage: ts-node src/upload-data.ts ppo <filePath> <seasonId>");
      process.exit(1);
    }
    await service.uploadPPOFromExcel(filePath, seasonId);
  } else {
    // existing code...
  }

  await appContext.close();
}
```

Run with:
```bash
ts-node src/upload-data.ts ppo ./path/to/ppo-data.xlsx <season-uuid>
```

## Verification: Dashboard Visibility

After import, verify PPO offers appear in dashboard:

### API Endpoints to Check:
1. **Overall Stats**: `GET /api/v1/analytics-dashboard/statsOverall/:seasonId`
2. **Department-wise**: `GET /api/v1/analytics-dashboard/statsDepartmentWise/:seasonId`
3. **Category-wise**: `GET /api/v1/analytics-dashboard/statsCategoryWise/:seasonId`
4. **Gender-wise**: `GET /api/v1/analytics-dashboard/statsGenderWise/:seasonId`

### Expected Output:
```json
{
  "totalRegisteredStudentsCount": 150,
  "placedStudentsCount": 120,
  "placementPercentage": 80,
  "totalOffers": 135,
  "totalCompaniesOffering": 45,
  "highestPackage": 10300000,  // Should include PPO offers
  "lowestPackage": 500000,
  "meanPackage": 5000000,
  "medianPackage": 4500000
}
```

## Alternative: OffCampusOffer Approach (Quick Import)

If you don't need dashboard visibility immediately:

```typescript
async uploadPPOAsOffCampus(filePath: string, seasonId: string) {
  const data: IPPORowType[] = parseExcelFile(filePath);
  
  for (const row of data) {
    const student = await findOrCreateStudent(row);
    const company = await findOrCreateCompany(row.finalCompany);
    
    await this.offCampusOfferRepo.create({
      studentId: student.id,
      seasonId: seasonId,
      companyId: company.id,
      salary: row.finalOverallCtcLakhs * 100000,
      salaryPeriod: 'PER_ANNUM',
      role: row.finalRole || row.ppoRole,
      status: row.offerStatus || OfferStatusEnum.ACCEPTED,
      metadata: JSON.stringify({
        ppoFromCompany: row.internshipCompany,
        ppoOfferDate: row.ppoOfferDate,
        source: 'PPO_IMPORT',
      }),
    });
  }
}
```

## Summary & Recommendations

### ✅ Recommended Approach: OnCampusOffer Import
1. **Use OnCampusOffer model** for PPO data import
2. **Add required columns** to CSV: Season ID, Roll Number, Course, Program Year, Offer Status
3. **Create Job → Salary → Offer** chain for each PPO
4. **Store metadata** for PPO-specific information (internship company, dates, etc.)
5. **Verify dashboard** shows updated statistics

### 📊 Dashboard Visibility
- OnCampusOffers → ✅ **Visible in dashboard**
- OffCampusOffers → ❌ **NOT visible in current dashboard implementation**

### 🔄 Future Enhancements
1. Update analytics dashboard to include OffCampusOffers
2. Add PPO-specific filters/views
3. Create separate PPO import UI
4. Track internship-to-PPO conversion rates
5. Add validation for duplicate offers

### 📝 CSV Template
See the enhanced CSV format section above. Key additions:
- `Season ID` (required)
- `Roll Number` (required for finding students)
- `Course` and `Program Year` (for student creation)
- `Offer Status` (ACCEPTED/REJECTED/ONGOING)
- Separate internship and final offer details

## Questions?
Review the implementation in:
- `/src/services/DataService.ts` - Data upload logic
- `/src/db/models/OnCampusOfferModel.ts` - OnCampus offer structure
- `/src/analytics-dashboard/analytics-dashboard.service.ts` - Dashboard data retrieval
