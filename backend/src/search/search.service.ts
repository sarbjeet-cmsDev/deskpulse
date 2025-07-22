import { Injectable } from "@nestjs/common";
import { ProjectService } from "../project/project.service";
import { TaskService } from "../task/task.service";
import { CommentService } from "../comment/comment.service";
import { UserService } from "src/user/user.service";
import { log } from "console";

@Injectable()
export class SearchService {
    constructor(
        private readonly projectService: ProjectService,
        private readonly taskService: TaskService,
        private readonly commentService: CommentService
    ) { }
    async searchAll(query: string, userId:string) {
        const projects = await this.projectService.search(query,userId);
        const projectList = await this.projectService.findProjectsByUserId(userId, 1, 10000)
        const tasks = await this.taskService.search(query,projectList.data);
        const comments = await this.commentService.search(query,userId);
        return {
            projects,
            tasks,
            comments,
        };
    }

}
