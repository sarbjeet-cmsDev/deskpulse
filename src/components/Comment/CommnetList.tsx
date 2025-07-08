'use client';

import { useState } from 'react';
import { IComment } from '@/types/comment.interface';
import Link from 'next/link';
import Image from 'next/image';
import info from '@/assets/images/info.png';
import avatar from '@/assets/images/avt1.jpg';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/Form/Button';
import CommentInputSection from '@/components/Comment/commentSection';
import CommentService from '@/service/comment.service';

interface CommentProps {
  comments: IComment[];
  refreshComments: () => void;
}

export default function CommentList({ comments, refreshComments }: CommentProps) {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const handleDelete = async (id: string) => {
    try {
      await CommentService.deleteComment(id);
      refreshComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editContent.trim()) return;
    try {
      await CommentService.updateComment(id, { content: editContent });
      setActiveEditId(null);
      setEditContent('');
      refreshComments();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const renderMentions = (comment: IComment) => {
    console.log("comment---->",comment)
    let content = comment.content;
    if (!comment.mentioned_users || comment.mentioned_users.length === 0) return <span>{content}</span>;

    // Replace plain text usernames or IDs with styled mentions
    comment.mentioned_users.forEach((user: { username: any; }) => {
      const mentionTag = `@${user.username}`;
      const mentionRegex = new RegExp(`@${user.username}`, 'g');
      content = content.replace(mentionRegex, `<span class="text-blue-600 font-semibold">${mentionTag}</span>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  };

  if (!comments.length) {
    return <div className="text-gray-500 text-center mt-10">No comments available.</div>;
  }

  return (
    <div className="mt-6">
      <ul className="space-y-4">
        {comments.map((comment) => {
          const createdTime = comment.createdAt ? new Date(comment.createdAt) : new Date();
          const timeAgo = formatDistanceToNow(createdTime, { addSuffix: true });

          const isEditing = activeEditId === comment._id;
          const isReplying = activeReplyId === comment._id;

          return (
            <li key={comment._id} className="bg-white border border-gray-100 rounded p-4 shadow-sm hover:shadow-md">
              <div className="flex gap-4">
                {/* <Image src={avatar} alt="User Avatar" width={40} height={40} className="rounded-full" /> */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{comment.created_by || 'User'}</p>
                      <p className="text-xs text-gray-500">{timeAgo === 'less than a minute ago' ? 'Just now' : timeAgo}</p>
                    </div>
                    <div className="relative group">
                      <button className="text-gray-400 hover:text-gray-600">⋯</button>
                      <div className="absolute hidden group-hover:block right-0 mt-2 bg-white border shadow rounded text-sm z-10">
                        <button onClick={() => setActiveEditId(comment._id)} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Edit</button>
                        <button onClick={() => handleDelete(comment._id)} className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600">Delete</button>
                      </div>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Edit comment..."
                      />
                      <div className="flex gap-2">
                        <Button onPress={() => handleEdit(comment._id)} className="px-4 py-1">Save</Button>
                        <Button variant="light" onPress={() => setActiveEditId(null)} className="px-4 py-1">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-800">{renderMentions(comment)}</p>
                  )}

                  <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <button onClick={() => setActiveReplyId(comment._id)} className="hover:text-indigo-600">Reply</button>
                    <Link href={`/task/${comment.task}`} className="hover:text-indigo-600 flex items-center gap-1">
                      <Image src={info} alt="Details" width={16} height={16} />
                    </Link>
                  </div>

                  {isReplying && (
                    <div className="mt-3">
                      <CommentInputSection
                        taskId={comment.task}
                        createdBy={comment.created_by || ''}
                        onCommentCreated={() => {
                          setActiveReplyId(null);
                          refreshComments();
                        }}
                        inline
                      />
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}




// "use client";
// import { IComment } from "@/types/comment.interface";
// import Link from "next/link";
// import Image from "next/image";
// import info from "@/assets/images/info.png";
// import avatar from "@/assets/images/avt1.jpg";  
// import { formatDistanceToNow } from "date-fns";

// interface CommentProps {
//   comments: IComment[];
// }

// export default function CommentList({ comments }: CommentProps) {
//   if (!comments.length) return <div className="text-gray-500 text-center mt-10">No comments available.</div>;

//   return (
//     <div className="mt-6">
//       <ul>
//         {comments.map((comment) => {
//           const createdTime = comment.createdAt ? new Date(comment.createdAt) : new Date();
//           const timeAgo = formatDistanceToNow(createdTime, { addSuffix: true });

//           return (
//             <li
//               key={comment._id}
//               className="bg-white border border-gray-200 rounded flex items-start justify-between p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
//             >
//               <div className="flex items-start gap-4">
//                 <div className="flex-shrink-0">
//                   <Image
//                     src={avatar}
//                     alt="User Avatar"
//                     width={40}
//                     height={40}
//                     className="rounded-full"
//                   />
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-800 mb-1">{comment.content}</p>
//                   {/* {comment.mentioned && comment.mentioned.length > 0 && (
//                   <p className="text-sm text-gray-500">
//                     Mentioned:{" "}
//                     {comment.mentioned.map((id, index) => (
//                       <span key={id}>
//                         <Link href={`/user/${id}`} className="text-blue-500 hover:underline">
//                           {id}
//                         </Link>
//                         {index !== comment.mentioned.length - 1 && ", "}
//                       </span>
//                     ))}
//                   </p>
//                 )} */}
//                 </div>
//               </div>

//               <div className="flex flex-col items-end">
//                 <span className="text-xs text-gray-400 mb-2">
//                   {timeAgo === 'less than a minute ago' ? 'Just now' : timeAgo}
//                 </span>
//                 <Link href={`/task/${comment.task}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600">
//                   <Image src={info} alt="Details" width={16} height={16} />
//                 </Link>
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }





