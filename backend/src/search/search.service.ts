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
    async searchAll(query: string, userId: string) {
        const [projects, projectList] = await Promise.all([
            this.projectService.search(query, userId),
            this.projectService.findProjectsByUserId(userId, 1, 10000),
        ]);

        const projectIds = projectList.data.map((project: any) => project._id.toString());
        return {
            projects,
            tasks: await this.taskService.search(query, projectList.data),
            comments: await this.commentService.search(query, projectIds),
        };
    }

}
