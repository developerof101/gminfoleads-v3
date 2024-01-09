import { PartialType } from '@nestjs/swagger';
import { CreateFtpDto } from './create-ftp.dto';

export class UpdateFtpDto extends PartialType(CreateFtpDto) {}
