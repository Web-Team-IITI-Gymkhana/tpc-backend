import { Injectable } from "@nestjs/common";
import * as fsp from "fs/promises";
import * as fs from "fs";
import { IE_FOLDER, JD_FOLDER, RESUME_FOLDER } from "src/constants";

@Injectable()
export class FileService {
  resumeFolder = RESUME_FOLDER;
  ieFolder = IE_FOLDER;
  jdFolder = JD_FOLDER;

  async onModuleInit() {
    this.makeFolder(this.resumeFolder);
    this.makeFolder(this.ieFolder);
    this.makeFolder(this.jdFolder);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async uploadFile(filePath: string, file: any): Promise<boolean> {
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

  makeFolder(folderPath) {
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
  }
}
