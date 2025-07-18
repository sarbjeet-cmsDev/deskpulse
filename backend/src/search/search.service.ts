import { Injectable } from "@nestjs/common";
import { ProjectService } from "../project/project.service";
import { TaskService } from "../task/task.service";
import { CommentService } from "../comment/comment.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class SearchService {
    constructor(
        private readonly projectService: ProjectService,
        private readonly taskService: TaskService,
        private readonly commentService: CommentService
    ) { }
    async searchAll(query: string) {
        const projects = await this.projectService.search(query);
        const tasks = await this.taskService.search(query);
        const comments = await this.commentService.search(query);
        return {
            projects,
            tasks,
            comments,
        };
    }

}
