import { NotFoundException } from '@nestjs/common';
import { TaskService } from '../task/task.service';

export async function validateTaskId(taskService: TaskService, taskId: string) {
  const task = await taskService.findOne(taskId.toString());
  if (!task) {
    throw new NotFoundException(`Task with ID ${taskId} not found.`);
  }
  return task;
}
