"use client";
import { IComment } from "@/types/comment.interface";
import Link from "next/link";
import Image from "next/image";
import info from "@/assets/images/info.png";
import avatar from "@/assets/images/avt1.jpg";  
import { formatDistanceToNow } from "date-fns";

interface CommentProps {
  comments: IComment[];
}

export default function CommentList({ comments }: CommentProps) {
  if (!comments.length) return <div className="text-gray-500 text-center mt-10">No comments available.</div>;

  return (
    <div className="mt-6">
      <ul>
        {comments.map((comment) => {
          const createdTime = comment.createdAt ? new Date(comment.createdAt) : new Date();
          const timeAgo = formatDistanceToNow(createdTime, { addSuffix: true });

          return (
            <li
              key={comment._id}
              className="bg-white border border-gray-200 rounded-xl flex items-start justify-between p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">{comment.content}</p>
                  {/* {comment.mentioned && comment.mentioned.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Mentioned:{" "}
                    {comment.mentioned.map((id, index) => (
                      <span key={id}>
                        <Link href={`/user/${id}`} className="text-blue-500 hover:underline">
                          {id}
                        </Link>
                        {index !== comment.mentioned.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                )} */}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 mb-2">
                  {timeAgo === 'less than a minute ago' ? 'Just now' : timeAgo}
                </span>
                <Link href={`/task/${comment.task}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600">
                  <Image src={info} alt="Details" width={16} height={16} />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}





