"use client";

import { useState } from "react";
import { IComment } from "@/types/comment.interface";
import Link from "next/link";
import Image from "next/image";
import info from "@/assets/images/info.png";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/Form/Button";
import CommentInputSection from "@/components/Comment/commentSection";
import { deleteComment } from "@/utils/deleteComment";

interface CommentProps {
  comments: IComment[];
  refreshComments: () => void;
  fetchComments?: any;
}

export default function CommentList({
  comments,
  refreshComments,
  fetchComments,
}: CommentProps) {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
console.log(comments,"commentscomments")
  const renderMentions = (comment: IComment) => {
    let content = comment.content;
    if (!comment.mentioned_users || comment.mentioned_users.length === 0)
      return <span dangerouslySetInnerHTML={{ __html: content }} />;

    comment.mentioned_users.forEach((user: any) => {
      const mentionTag = `@${user.username}`;
      const mentionRegex = new RegExp(`@${user.username}`, "g");
      content = content.replace(
        mentionRegex,
        `<span class="text-blue-600 font-semibold">${mentionTag}</span>`
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  };

  const renderComment = (comment: IComment, isChild = false) => {
    const isEditing = activeEditId === comment._id;
    const isReplying = activeReplyId === comment._id;
    const createdTime = comment.createdAt
      ? new Date(comment.createdAt)
      : new Date();
    const timeAgo = formatDistanceToNow(createdTime, { addSuffix: true });

    const hasChildren = comments.some((c) => c.parent_comment === comment._id);

    return (
      <li
        key={comment._id}
        className={`bg-white border border-gray-100 rounded p-4 shadow-sm hover:shadow-md comment-section ${
          isChild ? "ml-10 mt-2" : "mt-4"
        }`}
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">
                  {comment.created_by || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {timeAgo === "less than a minute ago" ? "Just now" : timeAgo}
                </p>
              </div>
            </div>

            {isEditing ? (
              <div className="mt-2">
                <CommentInputSection
                  taskId={comment.task}
                  createdBy={comment.created_by || ""}
                  defaultValue={comment.content}
                  onCommentCreated={() => {
                    setActiveEditId(null);
                    refreshComments();
                  }}
                  onCancel={() => {
                    setActiveEditId(null);
                  }}
                  isEditing
                  commentId={comment._id}
                  inline
                />
              </div>
            ) : (
              <p className="mt-2 text-gray-800">{renderMentions(comment)}</p>
            )}

            <div className="flex gap-4 mt-3 text-sm text-gray-500">
              <Button
                onPress={() =>
                  setActiveReplyId((prev) =>
                    prev === comment._id ? null : comment._id
                  )
                }
                className="hover:text-indigo-600 border-none"
                variant="bordered"
              >
                {isReplying ? "Cancel" : "Reply"}
              </Button>

              {!hasChildren && (
                <>
                  <Button
                    onPress={() => {
                      setActiveEditId(comment._id);
                    }}
                    className="hover:text-indigo-600 border-none"
                    variant="bordered"
                  >
                    Edit
                  </Button>
                  <Button
                    onPress={() => {
                      deleteComment(comment._id, fetchComments);
                    }}
                    className="hover:text-red-600 text-red-500 border-none"
                    variant="bordered"
                  >
                    Delete
                  </Button>
                </>
              )}

              <Link
                href={`/task/${comment.task}`}
                className="hover:text-indigo-600 flex items-center gap-1 ml-auto"
              >
                <Image src={info} alt="Details" width={16} height={16} />
              </Link>
            </div>

            {isReplying && (
              <div className="mt-3">
                <CommentInputSection
                  defaultValue=""
                  taskId={comment.task}
                  createdBy={comment.created_by || ""}
                  onCommentCreated={() => {
                    setActiveReplyId(null);
                    refreshComments();
                  }}
                  onCancel={() => {
                    setActiveReplyId(null);
                  }}
                  parent_comment={comment._id}
                  inline
                />
              </div>
            )}

            {comments
              .filter((child) => child.parent_comment === comment._id)
              .map((child) => renderComment(child, true))}
          </div>
        </div>
      </li>
    );
  };

  const topLevelComments = comments.filter((c) => c.parent_comment);

  return (
    <div className="mt-6">
      <ul className="space-y-2">
        {topLevelComments.map((comment) => renderComment(comment))}
      </ul>
    </div>
  );
}
