import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression as NativeCronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { TaskStatus, TaskType } from '../task.entity';
import { TasksService } from '../tasks.service';

const CronExpression = {
  ...NativeCronExpression,
  EVERY_2_SECONDS: '*/2 * * * * *',
  EVERY_30_SECONDS: '*/30 * * * * *',
};

@Injectable()
export class ScheduleService {
  private environment: string;
  private readonly logger = new Logger(ScheduleService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly tasksService: TasksService,
  ) {
    this.environment = this.configService.get('NODE_ENV');
  }

  // @Cron(CronExpression.EVERY_2_SECONDS)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async executeTask() {
    this.logger.log(`Verifying executing tasks in [${this.environment}]...`);
    const inProgressTask = await this.tasksService.findTaskByStatus(
      TaskStatus.IN_PROGRESS,
    );
    if (inProgressTask) {
      this.logger.warn(`Task #${inProgressTask.id} is In Progress`);
    } else {
      const pendingTask = await this.tasksService.findTaskByStatus(
        TaskStatus.PENDING,
      );
      if (pendingTask) {
        await this.tasksService.update(pendingTask.id, {
          status: TaskStatus.IN_PROGRESS,
        });
        this.logger.verbose(
          `Executing Task #${pendingTask.id} in [${this.environment}]`,
        );
        try {
          await this.tasksService.executeTask(pendingTask.id);
          this.logger.verbose(
            `Finished executing Task #${pendingTask.id} in [${this.environment}]`,
          );
        } catch (e) {
          this.logger.error(
            `Error executing Task #${pendingTask.id} in [${this.environment}]`,
            e,
          );
        }
      } else {
        this.logger.log(`No pending tasks in [${this.environment}]...`);
      }
    }
  }
}
