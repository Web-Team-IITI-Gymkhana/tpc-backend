import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsInt, ValidateNested, IsString, IsEnum, IsBoolean, IsDateString, IsDate } from "class-validator";
import { OrderByEnum, MatchOptionsNumber, MatchOptionsString } from 'src/constants';
import { Type } from "class-transformer";
import { SelectionProcedureDetailsDto } from "./jaf";
import { GetStudentUsersReturnDto } from "./student";
import { JobCoordinatorRole } from "src/db/enums/jobCoordinatorRole";

export class FilterOptionsDto {
    @ApiPropertyOptional({
        type: MatchOptionsString
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => MatchOptionsString)
    id?: MatchOptionsString;

    @ApiPropertyOptional({
        type: MatchOptionsString
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => MatchOptionsString)
    role?: MatchOptionsString;

    @ApiPropertyOptional({
        type: MatchOptionsString
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => MatchOptionsString)
    recruiterId?: MatchOptionsString;

    @ApiPropertyOptional({
        type: MatchOptionsString
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => MatchOptionsString)
    companyId?: MatchOptionsString;

    @ApiPropertyOptional({
        type: MatchOptionsString
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => MatchOptionsString)
    seasonId?: MatchOptionsString;

    @ApiPropertyOptional({
        type: MatchOptionsString
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => MatchOptionsString)
    currentStatusId?: MatchOptionsString;

    @ApiPropertyOptional({
        type: MatchOptionsString
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => MatchOptionsString)
    status?: MatchOptionsString;

    @ApiPropertyOptional({
        type: MatchOptionsString
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => MatchOptionsString)
    year?: MatchOptionsString;

    @ApiPropertyOptional({
        type: MatchOptionsString
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => MatchOptionsString)
    type?: MatchOptionsString;

    @ApiPropertyOptional({
        type: MatchOptionsString
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => MatchOptionsString)
    name?: MatchOptionsString;
}

export class OrderOptionsDto {
    @ApiPropertyOptional({
        enum: OrderByEnum,
    })
    @IsOptional()
    @IsEnum(OrderByEnum)
    id?: string;

    @ApiPropertyOptional({
        enum: OrderByEnum,
    })
    @IsOptional()
    @IsEnum(OrderByEnum)
    seasonId?: string;

    @ApiPropertyOptional({
        enum: OrderByEnum,
    })
    @IsOptional()
    @IsEnum(OrderByEnum)
    year?: string;

    @ApiPropertyOptional({
        enum: OrderByEnum,
    })
    @IsOptional()
    @IsEnum(OrderByEnum)
    type?: string;

    @ApiPropertyOptional({
        enum: OrderByEnum,
    })
    @IsOptional()
    @IsEnum(OrderByEnum)
    companyId?: string;

    @ApiPropertyOptional({
        enum: OrderByEnum,
    })
    @IsOptional()
    @IsEnum(OrderByEnum)
    name?: string;

    @ApiPropertyOptional({
        enum: OrderByEnum,
    })
    @IsOptional()
    @IsEnum(OrderByEnum)
    role?: string;
    
    @ApiPropertyOptional({
        enum: OrderByEnum,
    })
    @IsOptional()
    @IsEnum(OrderByEnum)
    status?: string;
}

export class WhereOptionsDto {
    @ApiPropertyOptional({
        type: Number
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    from?: number;

    @ApiPropertyOptional({
        type: Number
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    to?: number;

    @ApiPropertyOptional({
        type: FilterOptionsDto
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => FilterOptionsDto)
    filterBy?: FilterOptionsDto;

    @ApiPropertyOptional({
        type: OrderOptionsDto
    })
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => OrderOptionsDto)
    orderBy?: OrderOptionsDto;
}

export class GetJobsSeasonReturnDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    year: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    type: string;
}

export class GetJobsCompanyReturnDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    name: string;
}

export class GetJobsStatusReturnDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    status: string;
}

export class GetJobsReturnDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    id: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    seasonId: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    companyId: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    recruiterId: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    currentStatusId: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    role: string;

    @ApiProperty({
        type: GetJobsCompanyReturnDto,
    })
    @ValidateNested({each: true})
    @Type(() => GetJobsCompanyReturnDto)
    company: GetJobsCompanyReturnDto;

    @ApiProperty({
        type: GetJobsSeasonReturnDto,
    })
    @ValidateNested({each: true})
    @Type(() => GetJobsSeasonReturnDto)
    season: GetJobsSeasonReturnDto;

    @ApiProperty({
        type: GetJobsStatusReturnDto,
    })
    @ValidateNested({each: true})
    @Type(() => GetJobsStatusReturnDto)
    currentStatus: GetJobsStatusReturnDto;
}

export class GetJobRecruiterReturnDto {
    @ApiProperty({
        type: GetStudentUsersReturnDto,
    })
    @ValidateNested({ each: true })
    @Type(() => GetStudentUsersReturnDto)
    user: GetStudentUsersReturnDto;

    @ApiProperty({
        type: GetJobsCompanyReturnDto,
    })
    @ValidateNested({ each: true })
    @Type(() => GetJobsCompanyReturnDto)
    company: GetJobsCompanyReturnDto;
}

export class GetJobTpcMemberDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    department: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    role: string;

    @ApiProperty({
        type: GetStudentUsersReturnDto,
    })
    @ValidateNested({ each: true })
    @Type(() => GetStudentUsersReturnDto)
    user: GetStudentUsersReturnDto;
}

export class GetJobCoordinatorReturnDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    role: string;

    @ApiProperty({
        type: GetJobTpcMemberDto,
    })
    @ValidateNested({ each: true })
    @Type(() => GetJobTpcMemberDto)
    tpcMember: GetJobTpcMemberDto; 
}

export class GetJobFacultyDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    department: string;

    @ApiProperty({
        type: GetStudentUsersReturnDto,
    })
    @ValidateNested({ each: true })
    @Type(() => GetStudentUsersReturnDto)
    user: GetStudentUsersReturnDto;
}

export class GetJobFacultyApprovalDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    approved: string;

    @ApiPropertyOptional({
        type: String,
    })
    @IsString()
    @IsOptional()
    remarks?: string;

    @ApiProperty({
        type: GetJobFacultyDto,
    })
    @ValidateNested({ each: true })
    @Type(() => GetJobFacultyDto)
    faculty: GetJobFacultyDto;
}   

export class GetJobReturnDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    id: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    seasonId: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    recruiterId: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    companyId: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    role: string;

    @ApiPropertyOptional({
        type: String,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    skills: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    location: string;

    @ApiPropertyOptional({
        type: Number,
    })
    @IsString()
    @IsOptional()
    noOfVacancies?: number;

    @ApiPropertyOptional({
        type: String,
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    offerLetterReleaseDate?: string;

    @ApiPropertyOptional({
        type: String,
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    joiningDate?: string;

    @ApiPropertyOptional({
        type: Number,
    })
    @IsString()
    @IsOptional()
    duration?: number;

    @ApiProperty({
        type: SelectionProcedureDetailsDto,
    })   
    @ValidateNested({each: true})
    @Type(() => SelectionProcedureDetailsDto)
    selectionProcedure: SelectionProcedureDetailsDto;

    @ApiPropertyOptional({
        type: String,
    })
    @IsString()
    @IsOptional()
    others?: string;

    @ApiPropertyOptional({
        type: String,
    })
    @IsString()
    @IsOptional()
    attachment?: string;

    @ApiProperty({
        type: Boolean,
    })
    @IsBoolean()
    active: boolean;

    @ApiProperty({
        type: GetJobsCompanyReturnDto,
    })
    @ValidateNested({each: true})
    @Type(() => GetJobsCompanyReturnDto)
    company: GetJobsCompanyReturnDto;

    @ApiProperty({
        type: GetJobsSeasonReturnDto,
    })
    @ValidateNested({each: true})
    @Type(() => GetJobsSeasonReturnDto)
    season: GetJobsSeasonReturnDto;

    @ApiProperty({
        type: GetJobsStatusReturnDto,
    })
    @ValidateNested({each: true})
    @Type(() => GetJobsStatusReturnDto)
    currentStatus: GetJobsStatusReturnDto;

    @ApiPropertyOptional({
        type: Array<GetJobsStatusReturnDto>,
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => GetJobsStatusReturnDto)
    jobStatuses?: GetJobsStatusReturnDto[];

    @ApiProperty({
        type: GetJobRecruiterReturnDto,
    })
    @ValidateNested({each: true})
    @Type(() => GetJobRecruiterReturnDto)
    recruiter: GetJobRecruiterReturnDto;

    @ApiProperty({
        type: Array<GetJobCoordinatorReturnDto>,
    })
    @ValidateNested({ each: true })
    @Type(() => GetJobCoordinatorReturnDto)
    jobCoordinators: GetJobCoordinatorReturnDto[];

    @ApiProperty({
        type: Array<GetJobFacultyApprovalDto>,
    })
    @ValidateNested({ each: true })
    @Type(() => GetJobFacultyApprovalDto)
    facultyApprovalRequests: GetJobFacultyApprovalDto[];
}

export class CreateJobCoordinatorsDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    tpcMemberId: string;

    @ApiProperty({
        enum: JobCoordinatorRole,
    })
    @IsEnum(JobCoordinatorRole)
    role: JobCoordinatorRole;

    jobId: string;
}