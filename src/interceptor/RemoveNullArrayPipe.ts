import { ArgumentMetadata, ParseArrayPipe } from "@nestjs/common";

export class RemoveNullArrayPipe extends ParseArrayPipe {
  async transform(value: object[], metadata: ArgumentMetadata) {
    // Call the parent class's transform method to perform standard validation
    const transformedValues = await super.transform(value, metadata);

    // Remove null values from the transformed value
    const ans = transformedValues.map((transformedValue) => {
      for (const prop in transformedValue) {
        if (transformedValue.hasOwnProperty(prop) && transformedValue[prop] === null) {
          delete transformedValue[prop];
        }
      }

      return transformedValue;
    });

    return ans;
  }
}
