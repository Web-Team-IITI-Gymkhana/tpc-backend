import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs/promises";
import * as path from "path";

@Injectable()
export class FileService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async uploadFile(file: any): Promise<string> {
    const folderName = process.env.UPLOAD_DIR;
    const filename = uuidv4() + path.extname(file.originalname);
    const filePath = path.join(folderName, filename);
    const ans = await fs.writeFile(filePath, file.buffer);

    return filename;
  }
}
