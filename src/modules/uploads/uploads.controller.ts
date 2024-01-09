import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  UseInterceptors,
  Req,
  UploadedFile,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import slugify from 'slugify';
import { v4 as uuid } from 'uuid';

import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Public, Roles } from '../../auth/decorators';
import { RoleCodes } from '../system-roles/system-role.entity';
import {
  HttpException,
  HttpExceptionMessage,
} from '../../utils/HttpExceptionFilter';
import { UploadsService } from './uploads.service';

const ATTACHMENTS_FILE_PATH = 'attachments';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Public()
  @Post('/attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'temp/',
        filename: (req, file, cb) => {
          const splittedName = file.originalname.split('.');
          const ext = splittedName[splittedName.length - 1];
          const normalizedFileName = slugify(splittedName[0], {
            replacement: '-',
            lower: true,
          });
          cb(null, `${normalizedFileName}-${new Date().getTime()}.${ext}`);
        },
      }),
    }),
  )
  async uploadInvoices(@Req() req: any, @UploadedFile() file: any) {
    if (!file)
      throw new HttpExceptionMessage(
        HttpStatus.BAD_REQUEST,
        'File is required',
      );
    const localFilePath = file.path;

    const fileName = file.filename;
    const filePath = `${ATTACHMENTS_FILE_PATH}/${fileName}`;

    const uploadedFile = await this.uploadsService.uploadAndGetPublicUrl(
      localFilePath,
      filePath,
    );

    // Delete the file after it's uploaded to the cloud
    this.uploadsService.deleteFile(localFilePath);

    return uploadedFile;
  }
}
