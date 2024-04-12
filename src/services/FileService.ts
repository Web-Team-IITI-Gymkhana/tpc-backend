import { Injectable } from "@nestjs/common";
import * as fsp from "fs/promises";
import * as fs from "fs";
import * as path from "path";
import { env } from "src/config";

@Injectable()
export class FileService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async uploadFile(filePath, file: any): Promise<boolean> {
    await fsp.writeFile(filePath, file.buffer);

    return true;
  }

  getFile(filepath: string): fs.ReadStream {
    const stream = fs.createReadStream(filepath);

    return stream;
  }

  async deleteFile(filePath: string): Promise<boolean> {
    await fsp.unlink(filePath);

    return true;
  }

  async getFileasBuffer(filepath: string): Promise<Buffer> {
    const ans = await fsp.readFile(filepath);

    return ans;
  }
}
