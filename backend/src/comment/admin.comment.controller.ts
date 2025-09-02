import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { Comment } from "./comment.interface";
import { AdminGuard } from "src/guard/admin.guard";

@Controller("api/admin/comment")
@UseGuards(AdminGuard)
export class AdminCommentController {
  constructor(private readonly commentService: CommentService) { }


  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("keyword") keyword?: string,
    @Query("sortOrder") sortOrder: "asc" | "desc" = "asc"
  ): Promise<{ data: Comment[]; total: number }> {
    return this.commentService.findAllComment(
      page,
      limit,
      keyword,
      sortOrder
    );
  }



  @Delete(":id")
  async remove(@Param("id") id: string): Promise<any> {
    await this.commentService.remove(id);
    return {
      message: "Comment deleted successfully!",
    };
  }
}
