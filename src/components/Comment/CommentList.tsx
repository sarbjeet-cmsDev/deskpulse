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
import ShowMoreLess from "../common/ShowMoreLess/ShowMoreLess";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";

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
  const params = useParams();
  const taskCode = params?.id as string;
  const userData = useSelector((state: RootState) => state.user.data);
  const step = 5;
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(step);

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

    const hasChildren = comments.some((c) =>
      Array.isArray(c.parent_comment)
        ? c.parent_comment.includes(comment._id)
        : c.parent_comment === comment._id
    );

    return (
      <div
        key={comment._id}
        className={`rounded-xl border p-4 transition-shadow duration-200 ${isChild ? "ml-4 sm:ml-6 md:ml-10" : "mt-5"
          } bg-gray-50 border-gray-200 hover:shadow-md`}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900 break-words">
                  {comment.created_by || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {timeAgo === "less than a minute ago" ? "Just now" : timeAgo}
                </p>
              </div>
            </div>

            {/* Content or Editor */}
            {isEditing ? (
              <div className="mt-3">
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
                  isButton={true}
                  title="Edit Comment"
                />
              </div>
            ) : (
              <p className="mt-3 text-gray-800 leading-relaxed break-words whitespace-pre-line text-sm sm:text-base">
                {renderMentions(comment)}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-500">
              <button
                onClick={() =>
                  setActiveReplyId((prev) =>
                    prev === comment._id ? null : comment._id
                  )
                }
                className="hover:text-indigo-600 focus:outline-none"
              >
                {isReplying ? "Cancel" : "Reply"}
              </button>

              {!hasChildren && (
                <>
                  {userData?._id === comment?.UserId && (
                    <>
                      <button
                        onClick={() => setActiveEditId(comment._id)}
                        className="hover:text-indigo-600 focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteComment(comment._id, fetchComments)}
                        className="hover:text-red-600 text-red-500 focus:outline-none"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Reply Input */}
            {isReplying && (
              <div className="mt-4">
                <CommentInputSection
                  defaultValue=""
                  taskId={comment.task}
                  onCommentCreated={() => {
                    setActiveReplyId(null);
                    refreshComments();
                  }}
                  onCancel={() => {
                    setActiveReplyId(null);
                  }}
                  parent_comment={comment._id}
                  inline
                  isButton={true}
                  title="Comment"
                  code={taskCode}

                />
              </div>
            )}

            {/* Nested Replies */}
            <div className="mt-4">
              {comments
                .filter((child) =>
                  Array.isArray(child.parent_comment)
                    ? child.parent_comment.includes(comment._id)
                    : child.parent_comment === comment._id
                )
                .map((child) => renderComment(child, true))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get top-level comments (no parent or empty parent_comment array)
  const topLevelComments = comments.filter(
    (comment) =>
      !comment.parent_comment ||
      (Array.isArray(comment.parent_comment) &&
        comment.parent_comment.length === 0)
  );

  const visibleTopComments = topLevelComments.slice(0, visibleCount);


  return (
    <div className="mt-6">
      <ul className="space-y-2">
        {visibleTopComments.map((comment) => renderComment(comment))}
      </ul>

      <ShowMoreLess
        totalItems={topLevelComments.length}
        visibleCount={visibleCount}
        step={step}
        onChange={setVisibleCount}
      />
    </div>
  );
}
