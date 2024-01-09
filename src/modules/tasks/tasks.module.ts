import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { ScheduleService } from './schedule/schedule.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UploadsModule],
  providers: [TasksService, ScheduleService],
  exports: [TasksService],
})
export class TasksModule {}
