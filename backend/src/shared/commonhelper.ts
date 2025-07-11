import { NotFoundException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as cheerio from 'cheerio';
import { TaskService } from "src/task/task.service";
import { ProjectService } from "src/project/project.service";
import { log } from "node:console";

// ✅ Reusable helper to get a user’s basic details
const getUser = async (userService: UserService, userId: string) => {
  if (!userId) return null;
  const user = await userService.findOne(userId);
  if (!user) return null;
  return { id: user._id, username: user.username, email: user.email };
};

// ✅ Throws 404 if user not found
export const getUserDetailsById = async (userService: UserService, userId: string) => {
  const user = await getUser(userService, userId);
  if (!user) throw new NotFoundException(`User with ID "${userId}" was not found.`);
  return user;
};

export const getUserDetailsById1 = async (userService: UserService, userId: string) => {
  const user = await getUser(userService, userId);
  if (!user) throw new NotFoundException(`User with ID "${userId}" was not found.`);
  return user.username;
};


// ✅ Extract plain text from HTML string
export function extractTextFromHtml(html: string): string {
  const $ = cheerio.load(html);
  return $.text().trim();
}

// ✅ Fetch task + project + related user details by task ID
export async function fetchTaskProjectUserDetailsByTaskID(
  {
    taskService,
    projectService,
    userService,
  }: {
    taskService: TaskService;
    projectService: ProjectService;
    userService: UserService;
  },
  { taskId, userId }: { taskId: string, userId: string }
) {
  const task = await taskService.findOne(taskId);
  if (!task) throw new NotFoundException(`Task with ID "${taskId}" not found.`);

  const project = await projectService.findOne(task.project.toString());
  if (!project) throw new NotFoundException(`Project with ID "${task.project}" not found.`);

  // Task user fields
  const taskUserFields = [
    { field: 'assigned_to', alias: 'assignedUser' },
    { field: 'report_to', alias: 'reportToUser' },
  ];

  const taskUsers: Record<string, any> = {};
  for (const { field, alias } of taskUserFields) {
    const userId = task[field];
    taskUsers[alias] = userId ? await getUser(userService, userId.toString()) : null;
  }

  const userData = await getUser(userService, userId.toString());

  // Project user fields
  const projectUserFields = [
    { field: 'project_coordinator', alias: 'projectCoordinator' },
    { field: 'team_leader', alias: 'teamLeader' },
    { field: 'project_manager', alias: 'projectManager' },
  ];

  const projectUsers: Record<string, any> = {};
  for (const { field, alias } of projectUserFields) {
    const userId = project[field];
    projectUsers[alias] = userId ? await getUser(userService, userId.toString()) : null;
  }

  return {
    task: {
      ...task,
      ...taskUsers,
    },
    project: {
      ...project,
      ...projectUsers,
    },
    userData
  };
}


export async function fetchProjectUserDetailsByTaskData({ projectService, userService, updatedTask }) {
  // Helper to get user by ID with safe null handling
  // Fetch project
  const project = await projectService.findOne(updatedTask.project?.toString());
  if (!project) {
    throw new NotFoundException(`Project with ID "${updatedTask.project}" not found.`);
  }

  // Task-related users
  const taskUserFields = [
    { field: 'assigned_to', alias: 'assignedUser' },
    { field: 'report_to', alias: 'reportToUser' },
  ];

  const taskUsers = {};
  for (const { field, alias } of taskUserFields) {
    const userId = updatedTask[field];
    taskUsers[alias] = userId ? await getUser(userService, userId.toString()) : null;
  }

  // Project-related users
  const projectUserFields = [
    { field: 'project_coordinator', alias: 'projectCoordinator' },
    { field: 'team_leader', alias: 'teamLeader' },
    { field: 'project_manager', alias: 'projectManager' },
  ];

  const projectUsers = {};
  for (const { field, alias } of projectUserFields) {
    const userId = project[field];
    projectUsers[alias] = userId ? await getUser(userService, userId.toString()) : null;
  }

  return {
    task: {
      ...updatedTask,
      ...taskUsers,
    },
    project: {
      ...project,
      ...projectUsers,
    },
  };
}
