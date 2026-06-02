import {
    IsArray,
    IsOptional,
    IsString,
    ArrayUnique,
    IsEmail,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateAnnouncementDto {
    @IsString()
    clubname: string;

    @IsString()
    heading: string;

    @IsString()
    info: string;

    @IsOptional()
    @IsString()
    announcelogo?: string;

    @IsOptional()
    @IsString()
    group?: string;

    @IsOptional()
    @Type(() => String)
    @IsArray()
    @ArrayUnique()
    @IsEmail({}, { each: true })
    emails?: string[];
}