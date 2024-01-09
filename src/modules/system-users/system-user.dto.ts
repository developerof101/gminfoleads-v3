import {
  IsString,
  IsEmail,
  IsPositive,
  IsOptional,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

import { JobtitleTypes } from './system-user.entity';
import { Trim } from '../../utils/transformers';

export class CreateUserDto {
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('lang.IS_STRING', {
        field: 'email',
        entity: 'system-user',
      }),
    },
  )
  @ApiProperty()
  readonly email: string;

  @IsUrl(
    {},
    {
      message: i18nValidationMessage('lang.IS_URL', {
        field: 'avatar',
        entity: 'system-user',
      }),
    },
  )
  @IsOptional()
  @ApiProperty()
  readonly avatar: string;

  @IsString({
    message: i18nValidationMessage('lang.IS_STRING', {
      field: 'firstName',
      entity: 'system-user',
    }),
  })
  @IsOptional()
  @ApiProperty()
  readonly firstName: string;

  @IsString({
    message: i18nValidationMessage('lang.IS_STRING', {
      field: 'lastName',
      entity: 'system-user',
    }),
  })
  @IsOptional()
  @ApiProperty()
  readonly lastName: string;

  @IsString({
    message: i18nValidationMessage('lang.IS_STRING', {
      field: 'fullName',
      entity: 'system-user',
    }),
  })
  @IsOptional()
  @ApiProperty()
  readonly fullName: string;

  @IsOptional()
  @IsEnum(JobtitleTypes)
  @ApiProperty()
  readonly jobTitle: JobtitleTypes;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('lang.IS_STRING', {
      field: 'password',
      entity: 'system-user',
    }),
  })
  @ApiProperty()
  readonly password?: string;

  @Trim()
  @IsString({
    message: i18nValidationMessage('lang.IS_STRING', {
      field: 'username',
      entity: 'system-user',
    }),
  })
  readonly username: string;

  @IsPositive({ each: true })
  @ApiProperty()
  readonly roleIds: number[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
