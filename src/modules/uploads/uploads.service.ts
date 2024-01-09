import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { unlink } from 'fs';

@Injectable()
export class UploadsService {
  storage: Storage;
  bucket: string;
  constructor(private configService: ConfigService) {
    this.storage = new Storage();
    this.bucket = this.configService.get('GOOGLE_STORAGE_BUCKET');
  }

  async uploadToGoogle(
    filePath: string,
    fileDestination: string,
  ): Promise<string> {
    const [result] = await this.storage.bucket(this.bucket).upload(filePath, {
      destination: fileDestination,
    });
    return result.name;
  }

  async downloadFileFromGoogle(fileName: string, destination: string) {
    await this.storage
      .bucket(this.bucket)
      .file(fileName)
      .download({ destination });
  }

  /**
   * Uploads to GCP Storage Bucket
   * @param filePath File Path to Upload
   * @param fileDestination File Destination
   */
  async uploadAndGetPublicUrl(
    filePath: string,
    fileDestination: string,
  ): //  Promise<{ fileName: string; publicURL: string }>
  Promise<string> {
    const [result] = await this.storage.bucket(this.bucket).upload(filePath, {
      destination: fileDestination,
      // public: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
    // const publicURL = this.storage
    //   .bucket(this.bucket)
    //   .file(result.name)
    //   .publicUrl();
    // return { fileName: result.name, publicURL };

    // const [result] = await this.storage.bucket(this.bucket).upload(filePath, {
    //   destination: fileDestination,
    // });
    // const [url] = await this.storage
    //   .bucket(this.bucket)
    //   .file(result.name)
    //   .getSignedUrl({
    //     action: 'read',
    //     expires: Date.now() + 1000 * 60 * 60 * 24 * 120,
    //   });
    // return { fileName: result.name, publicURL: url };

    const [resultFile] = await this.storage
      .bucket(this.bucket)
      .upload(filePath, {
        destination: fileDestination,
      });
    await resultFile.makePublic();
    return `https://storage.googleapis.com/${this.bucket}/${resultFile.name}`;
  }

  async deleteFile(filePath: string) {
    // Delete local file with unlink
    await new Promise<void>((resolve) => {
      unlink(filePath, (error) => {
        if (error) {
          // tslint:disable-next-line:no-console
          console.error(
            `The file ${filePath} was not deleted. Memory probles might arrise.`,
          );
        }
        resolve();
      });
    });
  }
}
