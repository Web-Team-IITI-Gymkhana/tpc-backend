import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";

@Injectable()
export class RemoveNullValidationPipe extends ValidationPipe {
  constructor(args) {
    super(args);
  }
  async transform(value: any, metadata: ArgumentMetadata) {
    // Call the parent class's transform method to perform standard validation
    const transformedValue = await super.transform(value, metadata);

    // Remove null values from the transformed value
    for (const prop in transformedValue) {
      if (transformedValue.hasOwnProperty(prop) && transformedValue[prop] === null) {
        delete transformedValue[prop];
      }
    }

    return transformedValue;
  }
}
