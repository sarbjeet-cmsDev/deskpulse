"use client";

import {Card, CardBody} from "@heroui/react";
import Image from "next/image";
import wallet from "@/assets/images/wallet.png";
import AvatarList from "./avatarlist";
import CircularProgressBar from "./CircularProgess";
import { H6 } from "../Heading/H6";
import CardMetaTag from "./CardMetaItem";

export default function TodayTaskCard() {
  return (
    <a href="#" >
      <Card className=" !shadow-[0px_2px_36px_rgba(16,21,35,0.07)] py-[16px] px-[18px] rounded-[12px]">
        <CardBody className="p-0">
          <div className="mt-[14px] flex items-center gap-4" >
            <div className="w-[52px] h-[52px] bg-[#7980ff26] rounded-[8px] flex justify-center items-center">
                <Image src={wallet} alt="wallet-image"/>
            </div>
            
            <div className="box-progress flex-grow">
              <div className="flex justify-between items-center mb-2">
                    <div>
                        <H6 className="mb-2">Fintech Project</H6>
                        <div className="flex justify-center items-center gap-2">
                            <AvatarList/>
                            <CardMetaTag/>
                        </div>
                    </div>
                  <CircularProgressBar/>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </a>
  );
}
