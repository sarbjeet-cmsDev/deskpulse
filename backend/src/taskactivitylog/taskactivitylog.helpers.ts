// import { NotFoundException } from '@nestjs/common';
// import { TaskService } from 'src/task/task.service';
// import { UserService } from 'src/user/user.service';

// export async function validateTaskId(taskService: TaskService, taskId: string) {
//   const task = await taskService.findOne(taskId);
//   if (!task) throw new NotFoundException(`Task with ID "${taskId}" was not found.`);
//   return task;
// }

// export async function validateUserId(
//   userService: UserService,
//   userId: string,
//   fieldName = 'User'
// ) {
//   const user = await userService.findOne(userId);
//   if (!user) throw new NotFoundException(`${fieldName} with ID "${userId}" was not found.`);
//   return user;
// }

// /**
//  * Generic validator for dynamic fields from DTO
//  */
// export async function validateFields(dto: Record<string, any>, validators: Record<string, Function>) {
//   const results: Record<string, any> = {};
//   for (const [field, validatorFn] of Object.entries(validators)) {
//     const value = dto[field];
//     if (value) {
//       results[field] = await validatorFn(value, field);
//     }
//   }
//   return results;
// }
