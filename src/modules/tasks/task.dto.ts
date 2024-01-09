import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage as t } from 'nestjs-i18n';
import { PaginationOptionsDto } from '../../utils/pagination.dto';

import { TaskType, TaskStatus } from './task.entity';

export class CreateTaskDto {
  @IsEnum(TaskType, {
    message: t('lang.IS_ENUM', {
      field: 'type',
      entity: 'task',
    }),
  })
  @ApiProperty()
  readonly type: TaskType;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: t('lang.IS_ENUM', {
      field: 'status',
      entity: 'task',
    }),
  })
  readonly status?: TaskStatus;

  @IsOptional()
  @IsUrl(
    {},
    {
      message: t('lang.IS_URL', {
        field: 'filePath',
        entity: 'task',
      }),
    },
  )
  @MaxLength(255, {
    message: t('lang.MAX_LENGTH', {
      field: 'filePath',
      entity: 'task',
      length: 255,
    }),
  })
  readonly filePath?: string;

  @IsOptional()
  @IsUrl(
    {},
    {
      message: t('lang.IS_URL', {
        field: 'errorsFilePath',
        entity: 'task',
      }),
    },
  )
  @MaxLength(255, {
    message: t('lang.MAX_LENGTH', {
      field: 'errorsFilePath',
      entity: 'task',
      length: 255,
    }),
  })
  readonly errorsFilePath?: string;

  @IsOptional()
  @IsBoolean({
    message: t('lang.IS_BOOLEAN', {
      field: 'isASystemTask',
      entity: 'task',
    }),
  })
  @ApiProperty()
  readonly isASystemTask?: boolean;

  @IsOptional()
  @ApiProperty()
  readonly data?: any;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

export class FilterTasksDto extends PaginationOptionsDto {
  @IsOptional()
  @IsEnum(TaskType, {
    message: t('lang.IS_ENUM', {
      field: 'type',
      entity: 'task',
    }),
  })
  @ApiProperty()
  readonly type?: TaskType;

  @IsOptional()
  @IsEnum(TaskType, {
    each: true,
    message: t('lang.IS_ENUM', {
      field: 'types',
      entity: 'task',
    }),
  })
  @ApiProperty()
  readonly types?: TaskType[];

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: t('lang.IS_ENUM', {
      field: 'status',
      entity: 'task',
    }),
  })
  @ApiProperty()
  readonly status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskStatus, {
    each: true,
    message: t('lang.IS_ENUM', {
      field: 'statuses',
      entity: 'task',
    }),
  })
  @ApiProperty()
  readonly statuses?: TaskStatus[];
}
