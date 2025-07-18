"use client";

import { H3 } from "@/components/Heading/H3";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import Link from "next/link";
import { P } from "@/components/ptag";
import { useParams } from "next/navigation";



export default function ReminderDetailPage(){
    const params = useParams();
    const reminderId = params?.reminderId as string;
    
    console.log("reminderId",reminderId)
    return (
  <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[2%]">
          <Link href="/">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
        </div>
        <H3 className="w-[98%] text-center">Reminder Details</H3>
      </div>
      <div>
        <P>one</P>
      </div>
    </div>
    )
}