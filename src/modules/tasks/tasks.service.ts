import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { HttpException } from '../../utils/HttpExceptionFilter';
import { PaginationDto, PaginationMetaDto } from '../../utils/pagination.dto';
import { Task, TaskStatus, TaskType } from './task.entity';
import { CreateTaskDto, UpdateTaskDto, FilterTasksDto } from './task.dto';
import { UploadsService } from '../uploads/uploads.service';
import { ValidationError } from '../../utils/utils';

@Injectable()
export class TasksService {
  private fileDestination: string = null;
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    private uploadsService: UploadsService,
  ) {}

  async executeTask(id: number) {
    try {
      const task = await this.findOne(id);
      if (task.filePath) {
        const fileName = task.filePath.split('/').pop();
        this.fileDestination = `temp/${fileName}`;
        // Download the file to the temp folder
        if (task.filePath.length > 0) {
          // await this.uploadsService.downloadFileFromGoogle(
          //   task.filePath,
          //   this.fileDestination,
          // );
        }
      }
      let errors: ValidationError[] = [];

      switch (task.type) {
        default:
          break;
      }

      if (this.fileDestination) {
        try {
          await this.uploadsService.deleteFile(this.fileDestination);
          this.fileDestination = null;
        } catch (e) {
          console.error('Error deleting file', e);
        }
      }

      if (errors.length > 0) {
        console.error('The file has the following errors:', errors);
        // TODO: Create an error file
        await this.update(id, { status: TaskStatus.FAILED });
      } else {
        await this.update(id, { status: TaskStatus.COMPLETED });
      }
    } catch (e) {
      console.error('Error executing task', e);
      await this.update(id, { status: TaskStatus.FAILED });
      try {
        await this.uploadsService.deleteFile(this.fileDestination);
      } catch (e) {
        console.error('Error deleting file', e);
      }
    }
  }

  async findAll(params: FilterTasksDto) {
    const { type, types, status, statuses } = params;
    const query = this.taskRepo.createQueryBuilder('t');

    query.orderBy('t.id', params.order).offset(params.skip).limit(params.take);

    if (type) {
      query.andWhere('t.type = :type', { type });
    } else if (types) {
      query.andWhere('t.type IN (:...types)', { types });
    }

    if (status) {
      query.andWhere('t.status = :status', { status });
    } else if (statuses) {
      query.andWhere('t.status IN (:...statuses)', { statuses });
    }

    const itemCount = await query.getCount();
    const data = await query.getMany();

    const paginationMetaDto = new PaginationMetaDto({
      itemCount,
      paginationOptionsDto: params,
    });

    return new PaginationDto(data, paginationMetaDto);
  }

  async findTaskByStatus(status: TaskStatus) {
    return await this.taskRepo.findOne({
      where: { status, isDeleted: false },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOneBy({ id, isDeleted: false });
    // if (!task) throw new HttpException(HttpStatus.NOT_FOUND, 'TASK', 'f');
    return task;
  }

  async create(data: CreateTaskDto) {
    const newTask = this.taskRepo.create(data);
    return await this.taskRepo.save(newTask);
  }

  async update(id: number, changes: UpdateTaskDto) {
    const task = await this.findOne(id);
    this.taskRepo.merge(task, changes);
    return await this.taskRepo.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    task.isDeleted = true;
    return await this.taskRepo.save(task);
  }
}
