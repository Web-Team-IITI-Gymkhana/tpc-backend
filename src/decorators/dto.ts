import { ApiPropertyOptional, ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ValidateNested,
  IsOptional,
  IsObject,
  IsArray,
  IsString,
  IsEnum,
  IsNumber,
  IsDate,
  IsBoolean,
  IsUrl,
  IsEmail,
  IsUUID,
} from "class-validator";

// eslint-disable-next-line @typescript-eslint/naming-convention
export function NestedObject(options: { type: any; optional?: boolean; isArray?: boolean }) {
  const { type, optional, isArray } = options;
  const apiPropertyOptions: ApiPropertyOptions = { type };

  return (target: any, key: string) => {
    if (isArray) {
      apiPropertyOptions.isArray = true;
      IsArray()(target, key);
      ValidateNested({ each: true })(target, key);
      IsObject({ each: true })(target, key);
    } else {
      ValidateNested()(target, key);
      IsObject()(target, key);
    }

    if (optional) {
      ApiPropertyOptional(apiPropertyOptions)(target, key);
      IsOptional()(target, key);
    } else {
      ApiProperty(apiPropertyOptions)(target, key);
    }

    Type(() => type)(target, key);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function NestedString(options: { optional?: boolean; isArray?: boolean }) {
  const { optional, isArray } = options;
  const apiPropertyOptions: ApiPropertyOptions = { type: String };

  return (target: any, key: string) => {
    if (isArray) {
      apiPropertyOptions.isArray = true;
      IsArray()(target, key);
      IsString({ each: true })(target, key);
    } else {
      IsString()(target, key);
    }

    if (optional) {
      ApiPropertyOptional(apiPropertyOptions)(target, key);
      IsOptional()(target, key);
    } else {
      ApiProperty(apiPropertyOptions)(target, key);
    }

    Type(() => String)(target, key);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function NestedEnum(enumType: any, options: { optional?: boolean; isArray?: boolean }) {
  const { optional, isArray } = options;
  const apiPropertyOptions: ApiPropertyOptions = { enum: enumType };

  return (target: any, key: string) => {
    if (isArray) {
      apiPropertyOptions.isArray = true;
      IsArray()(target, key);
      IsEnum(enumType, { each: true })(target, key);
    } else {
      IsEnum(enumType)(target, key);
    }

    if (optional) {
      ApiPropertyOptional(apiPropertyOptions)(target, key);
      IsOptional()(target, key);
    } else {
      ApiProperty(apiPropertyOptions)(target, key);
    }

    Type(() => enumType)(target, key);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function NestedNumber(options: { optional?: boolean; isArray?: boolean }) {
  const { optional, isArray } = options;
  const apiPropertyOptions: ApiPropertyOptions = { type: Number };

  return (target: any, key: string) => {
    if (isArray) {
      apiPropertyOptions.isArray = true;
      IsArray()(target, key);
      IsNumber({}, { each: true })(target, key);
    } else {
      IsNumber()(target, key);
    }

    if (optional) {
      ApiPropertyOptional(apiPropertyOptions)(target, key);
      IsOptional()(target, key);
    } else {
      ApiProperty(apiPropertyOptions)(target, key);
    }

    Type(() => Number)(target, key);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function NestedDate(options: { optional?: boolean; isArray?: boolean }) {
  const { optional, isArray } = options;
  const apiPropertyOptions: ApiPropertyOptions = { type: Date };

  return (target: any, key: string) => {
    if (isArray) {
      apiPropertyOptions.isArray = true;
      IsArray()(target, key);
      IsDate({ each: true })(target, key);
    } else {
      IsDate()(target, key);
    }

    if (optional) {
      ApiPropertyOptional(apiPropertyOptions)(target, key);
      IsOptional()(target, key);
    } else {
      ApiProperty(apiPropertyOptions)(target, key);
    }

    Type(() => Date)(target, key);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function NestedBoolean(options: { optional?: boolean; isArray?: boolean }) {
  const { optional, isArray } = options;
  const apiPropertyOptions: ApiPropertyOptions = { type: Boolean };

  return (target: any, key: string) => {
    if (isArray) {
      apiPropertyOptions.isArray = true;
      IsArray()(target, key);
      IsBoolean({ each: true })(target, key);
    } else {
      IsBoolean()(target, key);
    }

    if (optional) {
      ApiPropertyOptional(apiPropertyOptions)(target, key);
      IsOptional()(target, key);
    } else {
      ApiProperty(apiPropertyOptions)(target, key);
    }

    Type(() => Boolean)(target, key);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function NestedUrl(options: { optional?: boolean; isArray?: boolean }) {
  const { optional, isArray } = options;
  const apiPropertyOptions: ApiPropertyOptions = { type: String };

  return (target: any, key: string) => {
    if (isArray) {
      apiPropertyOptions.isArray = true;
      IsArray()(target, key);
      IsUrl({}, { each: true })(target, key);
    } else {
      IsUrl()(target, key);
    }

    if (optional) {
      ApiPropertyOptional(apiPropertyOptions)(target, key);
      IsOptional()(target, key);
    } else {
      ApiProperty(apiPropertyOptions)(target, key);
    }

    Type(() => String)(target, key);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function NestedEmail(options: { optional?: boolean; isArray?: boolean }) {
  const { optional, isArray } = options;
  const apiPropertyOptions: ApiPropertyOptions = { type: String };

  return (target: any, key: string) => {
    if (isArray) {
      apiPropertyOptions.isArray = true;
      IsArray()(target, key);
      IsEmail({}, { each: true })(target, key);
    } else {
      IsEmail()(target, key);
    }

    if (optional) {
      ApiPropertyOptional(apiPropertyOptions)(target, key);
      IsOptional()(target, key);
    } else {
      ApiProperty(apiPropertyOptions)(target, key);
    }

    Type(() => String)(target, key);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function NestedUUID(options: { optional?: boolean; isArray?: boolean }) {
  const { optional, isArray } = options;
  const apiPropertyOptions: ApiPropertyOptions = { type: String };

  return (target: any, key: string) => {
    if (isArray) {
      apiPropertyOptions.isArray = true;
      IsArray()(target, key);
      IsUUID("all", { each: true })(target, key);
    } else {
      IsUUID("all")(target, key);
    }

    if (optional) {
      ApiPropertyOptional(apiPropertyOptions)(target, key);
      IsOptional()(target, key);
    } else {
      ApiProperty(apiPropertyOptions)(target, key);
    }

    Type(() => String)(target, key);
  };
}
