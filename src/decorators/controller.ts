import { Delete, Get, Patch, Post, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { QueryInterceptor } from "src/interceptor/QueryInterceptor";
import { ApiFilterQuery } from "src/utils/utils";

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GetValues(query, returnType) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Get()(target, key, descriptor);
    ApiFilterQuery("q", query)(target, key, descriptor);
    ApiResponse({ type: returnType, isArray: true })(target, key, descriptor);
    ApiOperation({ description: `Refer to ${query} for query schema. Ctrl+F it for more details` })(
      target,
      key,
      descriptor
    );
    UseInterceptors(QueryInterceptor)(target, key, descriptor);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GetValue(returnType) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Get("/:id")(target, key, descriptor);
    ApiParam({ name: "id", type: String })(target, key, descriptor);
    ApiResponse({ type: returnType })(target, key, descriptor);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function PostValues(bodyType) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Post()(target, key, descriptor);
    ApiBody({ type: bodyType, isArray: true })(target, key, descriptor);
    ApiResponse({ type: String, isArray: true })(target, key, descriptor);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function PatchValues(bodyType) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Patch()(target, key, descriptor);
    ApiBody({ type: bodyType, isArray: true })(target, key, descriptor);
    ApiResponse({ type: String, isArray: true })(target, key, descriptor);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function DeleteValues() {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Delete()(target, key, descriptor);
    ApiQuery({ name: "id", type: String, isArray: true })(target, key, descriptor);
    ApiResponse({ type: Number })(target, key, descriptor);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GetFile(mimetypes: string[], path: string = "") {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    path = path + "/:filename";
    Get(path)(target, key, descriptor);
    ApiOkResponse({ schema: { type: "string", format: "binary" } })(target, key, descriptor);
    ApiProduces(...mimetypes)(target, key, descriptor);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function CreateFile(type, name: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Post()(target, key, descriptor);
    UseInterceptors(FileInterceptor(name))(target, key, descriptor);
    ApiConsumes("multipart/form-data")(target, key, descriptor);
    ApiBody({ type: type })(target, key, descriptor);
    ApiResponse({ type: String })(target, key, descriptor);
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function DeleteFiles() {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Delete()(target, key, descriptor);
    ApiQuery({ name: "filename", type: String, isArray: true })(target, key, descriptor);
    ApiResponse({ type: Number })(target, key, descriptor);
  };
}
