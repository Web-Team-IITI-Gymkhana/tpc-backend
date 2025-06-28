import { Injectable, OnModuleInit, InternalServerErrorException, Logger } from "@nestjs/common";
import { google, drive_v3 } from "googleapis";
import * as path from "path";

@Injectable()
export class GoogleDriveService implements OnModuleInit {
  private drive: drive_v3.Drive;
  private readonly logger = new Logger(GoogleDriveService.name);

  async onModuleInit() {
    // Ensure environment variables are loaded
    const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
    // Replace newline characters in the private key for multi-line support
    const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!clientEmail || !privateKey) {
      this.logger.warn("Google Drive credentials (client email or private key) are not set in environment variables.");
      this.logger.warn("Google Drive service will not be available. File operations will fail.");
      return; // Don't throw error, just log warning for development
    }

    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    try {
      await jwtClient.authorize();
      this.drive = google.drive({ version: "v3", auth: jwtClient });
      this.logger.log("Google Drive service initialized successfully.");

      // Verify folder access on initialization
      const uploadFolderId = process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID;
      if (uploadFolderId) {
        try {
          const folderInfo = await this.verifyFolderAccess(uploadFolderId);
          this.logger.log(`Upload folder verified - Name: ${folderInfo.name}, Drive ID: ${folderInfo.driveId || 'Personal Drive'}`);
          
          if (!folderInfo.driveId) {
            this.logger.warn("The configured folder is on a Personal Drive. Service accounts cannot upload to personal drives.");
            this.logger.warn("Please create a Shared Drive and update GOOGLE_DRIVE_UPLOAD_FOLDER_ID with a folder from the shared drive.");
            this.logger.warn("File uploads will fail until this is resolved.");
          }
        } catch (verifyError) {
          this.logger.warn(`Could not verify upload folder access: ${verifyError.message}`);
          this.logger.warn("File uploads may fail. Ensure the service account has access to the folder.");
        }
      }
    } catch (error) {
      this.logger.error(`Failed to authorize Google Drive client: ${error.message}`, error.stack);
      this.logger.warn("Google Drive service will not be available. File operations will fail.");
    }
  }

  /**
   * Uploads a file to Google Drive.
   * @param fileName The desired name of the file in Google Drive.
   * @param mimeType The MIME type of the file (e.g., 'application/pdf').
   * @param fileBuffer The buffer containing the file data.
   * @returns The Google Drive file ID of the uploaded file.
   */
  async uploadFile(fileName: string, mimeType: string, fileBuffer: Buffer): Promise<string> {
    if (!this.drive) {
      this.logger.error("Google Drive service is not initialized. Cannot upload file.");
      throw new InternalServerErrorException("Google Drive service is not available.");
    }

    const parentFolderId = process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID;

    if (!parentFolderId) {
      this.logger.error("GOOGLE_DRIVE_UPLOAD_FOLDER_ID is not set in environment variables.");
      throw new InternalServerErrorException("Google Drive upload folder is not configured.");
    }

    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: mimeType,
          parents: [parentFolderId], // Upload to the specified folder
        },
        media: {
          mimeType: mimeType,
          body: fileBuffer.toString("binary"), // Convert buffer to binary string for upload
        },
        supportsAllDrives: true, // Enable support for shared drives
      });
      this.logger.log(`File uploaded to Google Drive: ${fileName} (ID: ${response.data.id})`);
      return response.data.id; // Return the Google Drive file ID
    } catch (error) {
      this.logger.error(`Failed to upload file to Google Drive: ${error.message}`, error.stack);
      
      if (error.message.includes("Service Accounts do not have storage quota")) {
        this.logger.error("The folder is on a Personal Drive. Service accounts cannot upload to personal drives.");
        this.logger.error("Please create a Shared Drive and update GOOGLE_DRIVE_UPLOAD_FOLDER_ID with a folder from the shared drive.");
        throw new InternalServerErrorException("Cannot upload to Personal Drive. Please configure a Shared Drive folder.");
      }
      
      throw new InternalServerErrorException("Failed to upload file to Google Drive.");
    }
  }

  /**
   * Retrieves a file from Google Drive as a Buffer.
   * @param fileId The Google Drive file ID.
   * @returns The file content as a Buffer.
   */
  async getFile(fileId: string): Promise<Buffer> {
    if (!this.drive) {
      this.logger.error("Google Drive service is not initialized. Cannot retrieve file.");
      throw new InternalServerErrorException("Google Drive service is not available.");
    }

    try {
      const response = await this.drive.files.get(
        { fileId: fileId, alt: "media", supportsAllDrives: true }, // Enable support for shared drives
        { responseType: "arraybuffer" } // Request as ArrayBuffer for binary data
      );
      this.logger.log(`File retrieved from Google Drive: ${fileId}`);
      return Buffer.from(response.data as ArrayBuffer); // Convert ArrayBuffer to Node.js Buffer
    } catch (error) {
      this.logger.error(`Failed to retrieve file from Google Drive: ${error.message}`, error.stack);
      throw new InternalServerErrorException("Failed to retrieve file from Google Drive.");
    }
  }

  /**
   * Deletes a file from Google Drive.
   * @param fileId The Google Drive file ID.
   * @returns True if deletion was successful, false otherwise.
   */
  async deleteFile(fileId: string): Promise<boolean> {
    if (!this.drive) {
      this.logger.error("Google Drive service is not initialized. Cannot delete file.");
      throw new InternalServerErrorException("Google Drive service is not available.");
    }

    try {
      await this.drive.files.delete({ fileId: fileId, supportsAllDrives: true }); // Enable support for shared drives
      this.logger.log(`File deleted from Google Drive: ${fileId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete file from Google Drive: ${error.message}`, error.stack);
      throw new InternalServerErrorException("Failed to delete file from Google Drive.");
    }
  }

  /**
   * Verifies if the service account can access the specified folder.
   * @param folderId The Google Drive folder ID to verify.
   * @returns Information about the folder and its accessibility.
   */
  async verifyFolderAccess(folderId: string): Promise<any> {
    if (!this.drive) {
      this.logger.error("Google Drive service is not initialized. Cannot verify folder access.");
      throw new InternalServerErrorException("Google Drive service is not available.");
    }

    try {
      // Try to get folder metadata with shared drive support
      const folderResponse = await this.drive.files.get({
        fileId: folderId,
        supportsAllDrives: true,
        fields: "id,name,mimeType,parents,driveId"
      });

      this.logger.log(`Folder verification successful: ${JSON.stringify(folderResponse.data)}`);
      return folderResponse.data;
    } catch (error) {
      this.logger.error(`Failed to verify folder access: ${error.message}`, error.stack);
      throw new InternalServerErrorException("Failed to verify folder access.");
    }
  }
}
