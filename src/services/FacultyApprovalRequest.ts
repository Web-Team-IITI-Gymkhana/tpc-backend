import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { FACULTY_APPROVAL_REQUEST_DAO } from "src/constants";
import { FacultyApprovalRequestModel } from "src/db/models";
import { FacultyApprovalRequest } from "src/entities/FacultyApprovalRequest";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class FacultyApprovalRequestService {
  private logger = new Logger(FacultyApprovalRequestService.name);

  constructor(@Inject(FACULTY_APPROVAL_REQUEST_DAO) private facultyApprovalRequestRepo: typeof FacultyApprovalRequestModel) { }

  async createOrGetFacultyApprovalRequest(facultyApprovalRequest: FacultyApprovalRequest, t?: Transaction) {
    const [facultyApprovalRequestModel] = await this.facultyApprovalRequestRepo.findOrCreate({
      where: omit(facultyApprovalRequest),
      defaults: omit(facultyApprovalRequest),
      transaction: t,
    });
    return FacultyApprovalRequest.fromModel(facultyApprovalRequestModel);
  }


  async getFacultyApprovalRequests(where: WhereOptions<FacultyApprovalRequestModel>, t?: Transaction) {
    const values = getQueryValues(where);
    const facultyApprovalRequestModels = await this.facultyApprovalRequestRepo.findAll({ where: values, transaction: t });
    return facultyApprovalRequestModels.map((facultyApprovalRequestModel) => FacultyApprovalRequest.fromModel(facultyApprovalRequestModel));
  }

  async updateFacultyApprovalRequest(facultyApprovalRequestId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.facultyApprovalRequestRepo.update(fieldsToUpdate, {
      where: { id: facultyApprovalRequestId },
      returning: true,
      transaction: t,
    });
    return FacultyApprovalRequest.fromModel(updatedModel[0]);
  }

  async deleteFacultyApprovalRequest(facultyApprovalRequestId: string, t?: Transaction) {
    return !!(await this.facultyApprovalRequestRepo.destroy({ where: { id: facultyApprovalRequestId }, transaction: t }));
  }
}

export default FacultyApprovalRequestService;
