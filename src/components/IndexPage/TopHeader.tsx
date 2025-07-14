"use client";

import Image from "next/image";
import avatarFallback from "@/assets/images/avt1.jpg";
import bell from "@/assets/images/bell.png";
import { H5 } from "@/components/Heading/H5";
import { P } from "@/components/ptag";
import { Button } from "@heroui/button";
import { openDrawer } from "@/store/slices/drawerSlice";
import { useDispatch, useSelector } from "react-redux";
import { CommonDrawer } from "../common/Drawer/Drawer";
import { Notification } from "../Notification/Notification";
import { RootState } from "@/store/store";
import { useState, useEffect } from "react";
import LeftMenuDrawer from "../HeaderMenuDrawer/leftmenudrawer";

export default function TopHeader() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);
  const [version, setVersion] = useState(Date.now()); // for cache busting

  // Cache-busting when image changes
  useEffect(() => {
    if (user?.profileImage) {
      setVersion(Date.now());
    }
  }, [user?.profileImage]);

  const avatarUrl = user?.profileImage
    ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${user.profileImage}?v=${version}`
    : avatarFallback.src;

  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User";

  return (
    <div className="bg-[#7980ff] p-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-2">
          <div className="relative">
            <Image
              key={avatarUrl} // force image re-render
              src={avatarUrl}
              alt="avatar-image"
              width={100}
              height={100}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <span className="dot-status w-[12px] h-[12px] border border-[#7980ff] bg-[#48bd69] rounded-[20px] absolute top-0 right-0"></span>
          </div>
          <div>
            <H5 className="text-white">{fullName}</H5>
            <P className="text-white text-start">
              {user?.firstName
                ? `Hi ${user.firstName}, Good Morning!`
                : "Welcome!"}
            </P>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          <LeftMenuDrawer />
          <Button
            variant="light"
            onPress={() =>
              dispatch(openDrawer({ size: "md", type: "notification" }))
            }
          >
            <Image src={bell} alt="notification" className="cursor-pointer" />
          </Button>
          <CommonDrawer type="notification">
            <Notification />
          </CommonDrawer>
        </div>
      </div>
    </div>
  );
}
