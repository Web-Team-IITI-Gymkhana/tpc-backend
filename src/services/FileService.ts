import { Injectable, InternalServerErrorException, OnModuleInit } from "@nestjs/common";
import { GoogleDriveService } from "src/services/GDrive";
import { Readable } from "stream";

// Constants for conceptual folder names (no longer actual paths)
// These constants are only for conceptual clarity if you use them to
// derive file names or categorizations. Actual Google Drive folder IDs
// are handled by environment variables in GoogleDriveService.
export const RESUME_FOLDER = "resumes"; // Conceptual folder name
export const IE_FOLDER = "ie"; // Conceptual folder name
export const JD_FOLDER = "jd"; // Conceptual folder name

@Injectable()
export class FileService implements OnModuleInit {
  // These properties are now conceptual, no longer local paths
  resumeFolder = RESUME_FOLDER;
  ieFolder = IE_FOLDER;
  jdFolder = JD_FOLDER;

  constructor(private readonly googleDriveService: GoogleDriveService) {}

  async onModuleInit() {
    // No longer needed for folder creation as Google Drive manages its own folders
    // GoogleDriveService's onModuleInit handles any necessary verification
  }

  /**
   * Uploads a file to Google Drive.
   * @param conceptualPath A conceptual path or filename that helps identify the file (e.g., 'jd/filename.pdf').
   * The actual Google Drive folder is managed by GoogleDriveService.
   * @param file An object containing file buffer and size.
   * @param mimeType The MIME type of the file (e.g., 'application/pdf').
   * @returns The Google Drive file ID of the uploaded file.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async uploadFile(conceptualPath: string, file: any, mimeType: string = "application/pdf"): Promise<string> {
    if (!file || !file.buffer) {
      throw new InternalServerErrorException("File data is missing for upload.");
    }

    // Extract filename from the conceptualPath
    const fileName = conceptualPath.split("/").pop();
    if (!fileName) {
      throw new InternalServerErrorException("Invalid conceptual path provided for file upload.");
    }

    // Delegate the actual upload to GoogleDriveService
    const fileId = await this.googleDriveService.uploadFile(fileName, mimeType, file.buffer);
    return fileId; // Return the Google Drive file ID
  }

  /**
   * Retrieves a file from Google Drive as a Buffer.
   * @param fileId The Google Drive file ID.
   * @returns The file content as a Buffer.
   */
  async getFileasBuffer(fileId: string): Promise<Buffer> {
    // Handle both file IDs and legacy paths
    const actualFileId = this.extractFileId(fileId);
    const buffer = await this.googleDriveService.getFile(actualFileId);
    return buffer;
  }

  /**
   * Retrieves a file from Google Drive as a Readable stream.
   * This method provides backward compatibility for existing code that expects a stream.
   * @param fileId The Google Drive file ID or legacy path.
   * @returns A Readable stream containing the file content.
   */
  getFile(fileId: string): Readable {
    // Create a readable stream from the buffer
    // This is done asynchronously but returns a readable stream immediately
    const stream = new Readable({
      read() {
        // Read method will be called when stream is consumed
      },
    });

    // Get the file buffer and push it to the stream
    this.getFileasBuffer(fileId)
      .then((buffer) => {
        stream.push(buffer);
        stream.push(null); // End the stream
      })
      .catch((error) => {
        stream.emit("error", error);
      });

    return stream;
  }

  /**
   * Deletes a file from Google Drive.
   * @param fileId The Google Drive file ID or legacy path.
   * @returns True if deletion was successful.
   */
  async deleteFile(fileId: string): Promise<boolean> {
    // Handle both file IDs and legacy paths
    const actualFileId = this.extractFileId(fileId);
    const success = await this.googleDriveService.deleteFile(actualFileId);
    return success;
  }

  /**
   * Helper method to extract file ID from either a Google Drive file ID or a legacy path.
   * For Google Drive migration: if the input looks like a path, extract the filename.
   * If it's already a file ID (UUID format), use it directly.
   * @param input The file ID or legacy path.
   * @returns The Google Drive file ID.
   */
  private extractFileId(input: string): string {
    // If input contains path separators, it's likely a legacy path
    if (input.includes("/") || input.includes("\\")) {
      // Extract filename from path - this should be the Google Drive file ID
      // In the new system, we store Google Drive file IDs in the database
      return input.split(/[/\\]/).pop() || input;
    }

    // If it doesn't contain path separators, assume it's already a file ID
    return input;
  }
}
