import { ArgumentMetadata, ParseArrayPipe } from "@nestjs/common";

export class RemoveNullArrayPipe extends ParseArrayPipe {
  removeNullValues(obj) {
    for (const key in obj) {
      if (obj[key] === null) delete obj[key];
      else if (typeof obj[key] === "object") obj[key] = this.removeNullValues(obj[key]);
    }

    return obj;
  }

  async transform(value: object[], metadata: ArgumentMetadata) {
    // Call the parent class's transform method to perform standard validation
    const transformedValues = await super.transform(value, metadata);

    // Remove null values from the transformed value
    const ans = transformedValues.map((transformedValue) => this.removeNullValues(transformedValue));

    return ans;
  }
}
