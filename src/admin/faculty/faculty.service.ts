// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { Student } from "../../db/models/student";
// //import { studentDto } from "./student.dto";
// import { Member } from "src/db/models/member";
// import { Role } from "src/db/enums/role.enum";
// import { Sequelize } from "sequelize-typescript";
// import { studentSearchDto } from "./studentSearch.dto";

// @Injectable()
// export class StudentService {
//   configService: any;
//   constructor(
//     private config: ConfigService,
//     private sequelize: Sequelize
//   ) {}

//   create_student = async (student: studentDto) => {
//     const t = await this.sequelize.transaction();
//     try {
//       // let studentEntry: any= {}
//       const {
//         name,
//         category,
//         gender,
//         branch,
//         contact,
//         graduationYear,
//         currentCPI,
//         totalPenalty,
//         rollNo,
//         resume,
//         email,
//       } = student;
//       // if(student.resume)          studentEntry.resume=student.resume;
//       // if(student.totalPenalty)    studentEntry.totalPenalty=student.totalPenalty;
//       // if(student.contact)         studentEntry.contact=student.contact;
//       console.log(t);
//       // inserting students in the member
//       const [statusFound, created] = await Member.findOrCreate({
//         where: { email },
//         defaults: { name, email, contact, role: Role.STUDENT },
//         transaction: t,
//       });

//       if (!created) {
//         // updating both member and student bcoz they already exists
//         const [rowsUpdated, [updatedEntity]] = await Member.update(
//           { name, role: Role.STUDENT, email, contact },
//           {
//             where: { email },
//             returning: true,
//             transaction: t,
//           }
//         );
//         const [rowsUpdated1, [newstudent]] = await Student.update(
//           {
//             name,
//             category,
//             gender,
//             branch,
//             graduationYear,
//             currentCPI,
//             totalPenalty,
//             rollNo,
//             resume,
//           },
//           // studentEntry,
//           {
//             where: { memberId: updatedEntity.id },
//             returning: true,
//             transaction: t,
//           }
//         );
//         return { data: newstudent, status: 200 };
//       } else {
//         // creating new student
//         const newstudent = await Student.create(
//           {
//             memberId: statusFound.id,
//             name,
//             category,
//             gender,
//             branch,
//             graduationYear,
//             currentCPI,
//             totalPenalty,
//             rollNo,
//             resume,
//           },
//           { transaction: t }
//         );
//         t.commit();
//         return { data: newstudent, status: 200 };
//       }
//     } catch (err) {
//       t.rollback();
//       console.log(err);
//       throw err;
//     }
//   };
//   async create(students: any): Promise<any> {
//     const notDone = [];
//     try {
//       const createStudentPromises = students.map(async (student: studentDto) => {
//         try {
//           const ans = await this.create_student(student);
//           return ans;
//         } catch (err) {
//           notDone.push(student);
//           throw err;
//         }
//       });
//       const createdStudents = await Promise.allSettled(createStudentPromises);
//       for (const student of createdStudents) {
//         if (student.status == "rejected") {
//           throw student.reason;
//         }
//       }
//       return { status: 200, output: createdStudents };
//     } catch (error) {
//       return { status: 400, rolledBackQueries: notDone, error: error };
//     }
//   }

//   queryBuilder = (params: any) => {
//     let studentQuery: any = {},
//       memberQuery: any = {};
//     if (params.name) {
//       memberQuery.name = params.name;
//       studentQuery.name = params.name;
//     }
//     if (params.email) {
//       memberQuery.email = params.email;
//     }
//     if (params.contact) {
//       memberQuery.contact = params.contact;
//     }
//     if (params.gender) {
//       studentQuery.gender = params.gender;
//     }
//     if (params.graduationYear) {
//       studentQuery.graduationYear = params.graduationYear;
//     }
//     if (params.resume) {
//       studentQuery.resume = params.resume;
//     }
//     if (params.totalPenalty) {
//       studentQuery.totalPenalty = params.totalPenalty;
//     }
//     if (params.rollNo) {
//       studentQuery.rollNo = params.rollNo;
//     }
//     if (params.category) {
//       studentQuery.category = params.category;
//     }
//     if (params.branch) {
//       studentQuery.branch = params.branch;
//     }
//     return { studentQuery, memberQuery };
//   };

//   async get(searchParams: studentSearchDto): Promise<any> {
//     try {
//       const { name, category, gender, branch, graduationYear, contact, currentCPI, totalPenalty, rollNo, email } =
//         searchParams;
//       const { studentQuery, memberQuery } = this.queryBuilder(searchParams);
//       const result = await Student.findAll({
//         where: studentQuery,
//         include: {
//           model: Member,
//           where: memberQuery,
//           required: true,
//         },
//       });
//       return { status: 200, data: result };
//     } catch (error) {
//       console.log(error);
//       return { status: 400, error: error };
//     }
//   }

//   async update(searchAndUpdate: any): Promise<any> {}
// }
