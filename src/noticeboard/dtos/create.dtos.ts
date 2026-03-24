import { IsOptional, IsString, IsArray } from "class-validator";

export class CreateAnnouncementDto {
    @IsString()
    clubname: string;

    @IsString()
    heading: string;

    @IsString()
    info: string;

    @IsString()
    announcelogo: string;

    @IsOptional()
    @IsString()
    group?: string;

    @IsOptional()
    @IsArray()
    emails?: string[];
}