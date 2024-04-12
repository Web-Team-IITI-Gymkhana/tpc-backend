import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";

@Injectable()
export class RemoveNullValidationPipe extends ValidationPipe {
  removeNullValues(obj) {
    for (const key in obj) {
      if (obj[key] === null) delete obj[key];
      else if (typeof obj[key] === "object") obj[key] = this.removeNullValues(obj[key]);
    }

    return obj;
  }

  async transform(value: object, metadata: ArgumentMetadata) {
    // Call the parent class's transform method to perform standard validation
    const transformedValue = await super.transform(value, metadata);

    return this.removeNullValues(transformedValue);
  }
}
