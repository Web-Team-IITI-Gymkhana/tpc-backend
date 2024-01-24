import { Injectable } from "@nestjs/common";
import {v4 as uuidv4} from "uuid";
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileService {
    async uploadFile(file: any): Promise<String> {
        const folderName = process.env.FOLDER_NAME;
        const filename = uuidv4()+path.extname(file.originalname);
        const filePath = path.join(folderName, filename);
        const ans = await fs.writeFile(filePath, file.buffer);
        return filename;
    }
};