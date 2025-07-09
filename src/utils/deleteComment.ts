import { SweetAlert } from "@/components/common/SweetAlert/SweetAlert";
import CommentService from "@/service/comment.service";

export const deleteComment = async (commentId: string, fetchComments?: any) => {
  const confirmed = await SweetAlert({
    title: "Are you sure?",
    text: `You are about to delete comment  this comment"}`,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
  });

  if (!confirmed) return;

  try {
    await CommentService.deleteComment(commentId);
    fetchComments();
  } catch (error) {
    console.error("Delete failed:", error);
  }
};
