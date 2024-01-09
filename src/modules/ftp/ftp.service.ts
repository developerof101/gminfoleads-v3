import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectOptions } from 'ssh2-sftp-client';
import Client = require('ssh2-sftp-client');

import { CreateFtpDto } from './dto/create-ftp.dto';
import { UpdateFtpDto } from './dto/update-ftp.dto';

@Injectable()
export class FtpService {
  private readonly logger = new Logger(FtpService.name);
  private client: Client;
  private ftpHost: string;
  private ftpPort: number;
  private ftpUser: string;
  private ftpPassword: string;
  constructor(private readonly configService: ConfigService) {
    this.client = new Client();
    this.ftpHost = this.configService.get<string>('FTP_HOST');
    this.ftpPort = this.configService.get<number>('FTP_PORT');
    this.ftpUser = this.configService.get<string>('FTP_USER');
    this.ftpPassword = this.configService.get<string>('FTP_PASSWORD');
  }

  async connect() {
    const options: ConnectOptions = {
      host: this.ftpHost,
      port: this.ftpPort,
      username: this.ftpUser,
      password: this.ftpPassword,
    };
    this.logger.log(`Connecting to ${options.host}:${options.port}`);
    try {
      await this.client.connect(options);
      this.logger.log('Connected');
    } catch (err) {
      this.logger.error('Failed to connect:', err);
    }
  }

  // This function list all contents of a directory
  async listFiles(
    remoteDir: string,
    fileGlob: Client.ListFilterFunction = () => true,
  ): Promise<Client.FileInfo[]> {
    await this.connect();
    this.logger.log(`Listing ${remoteDir} ...`);
    let fileObjects: Client.FileInfo[];
    try {
      fileObjects = await this.client.list(remoteDir, fileGlob);
    } catch (err) {
      this.logger.error('Listing failed:', err);
      return [];
    }

    const fileNames: string[] = [];

    for (const file of fileObjects) {
      if (file.type === 'd') {
        console.log(
          `${new Date(file.modifyTime).toISOString()} PRE ${file.name}`,
        );
      } else {
        console.log(
          `${new Date(file.modifyTime).toISOString()} ${file.size} ${
            file.name
          }`,
        );
      }

      fileNames.push(file.name);
    }

    // await this.client.end();
    // return fileNames;
    return fileObjects;
  }

  async listFiles2(remoteDir: string) {
    await this.connect();
    console.log(`Listing ${remoteDir} ...`);
    let fileObjects;
    try {
      // fileObjects = await this.client.list(remoteDir, fileGlob);
      fileObjects = await this.client.list(remoteDir);
      console.log('fileObjects', fileObjects);
    } catch (err) {
      console.log('Listing failed:', err);
      return [];
    }

    const fileNames: string[] = [];

    for (const file of fileObjects) {
      if (file.type === 'd') {
        console.log(
          `${new Date(file.modifyTime).toISOString()} PRE ${file.name}`,
        );
      } else {
        console.log(
          `${new Date(file.modifyTime).toISOString()} ${file.size} ${
            file.name
          }`,
        );
      }

      fileNames.push(file.name);
    }

    // await this.client.end();
    return fileNames;
  }

  create(createFtpDto: CreateFtpDto) {
    return 'This action adds a new ftp';
  }

  findAll() {
    return `This action returns all ftp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ftp`;
  }

  update(id: number, updateFtpDto: UpdateFtpDto) {
    return `This action updates a #${id} ftp`;
  }

  remove(id: number) {
    return `This action removes a #${id} ftp`;
  }
}
