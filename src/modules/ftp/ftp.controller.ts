import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FtpService } from './ftp.service';
import { CreateFtpDto } from './dto/create-ftp.dto';
import { UpdateFtpDto } from './dto/update-ftp.dto';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators';
import { RoleCodes } from '../system-roles/system-role.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ftp')
export class FtpController {
  constructor(private readonly ftpService: FtpService) {}

  @Get()
  connect() {
    return this.ftpService.connect();
  }

  @Roles(RoleCodes.SUPER_ADMIN)
  @Get('/list')
  list() {
    return this.ftpService.listFiles('/Exata_101');
  }

  @Post()
  create(@Body() createFtpDto: CreateFtpDto) {
    return this.ftpService.create(createFtpDto);
  }

  @Get()
  findAll() {
    return this.ftpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ftpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFtpDto: UpdateFtpDto) {
    return this.ftpService.update(+id, updateFtpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ftpService.remove(+id);
  }
}
