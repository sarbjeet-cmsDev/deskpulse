'use client';

import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";
import { useEffect, useState } from "react";
import CommentService from "@/service/comment.service";
import { IComment } from "@/types/comment.interface";
// import CommentList from "@/components/Comment/CommnetList";
import { IUserRedux } from "@/types/user.interface";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";

export default function MyCommentList() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user: IUserRedux | null = useSelector((state: RootState) => state.auth.user);
  
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await CommentService.getCommentsByUser(user?.id || '');
      setComments(res);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[2%]">
          <Link href="/">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
        </div>
        <H3 className="w-[98%] text-center">Inbox</H3>
      </div>

      <div className="p-4">
      {/* <CommentList comments={comments} refreshComments={function (): void {
          throw new Error("Function not implemented.");
        } }/> */}
      </div>
    </div>
  );
}
