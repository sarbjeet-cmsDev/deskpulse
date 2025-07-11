"use client";
import Image from "next/image";
import avatar from "@/assets/images/avt1.jpg";
import bell from "@/assets/images/bell.png";
import { H5 } from "@/components/Heading/H5";
import { P } from "@/components/ptag";
import { Button } from "@heroui/button";
import { openDrawer } from "@/store/slices/drawerSlice";
import { useDispatch } from "react-redux";
import { CommonDrawer } from "../common/Drawer/Drawer";
import { Notification } from "../Notification/Notification";
import { IUserRedux } from "@/types/user.interface";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import UserService from "@/service/user.service";
import { IUser } from "@/service/adminUser.service";
import LeftMenuDrawer from "../HeaderMenuDrawer/leftmenudrawer";



export default function TopHeader() {
  const[userData, setUserData] = useState<IUser | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(avatar.src);
  const user: IUserRedux | null = useSelector((state: RootState) => state.auth.user);
  let userId = user?.id
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    try {
      const data = await UserService.getUserById();
      setUserData(data);
      setAvatarUrl(data.profileImage ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${data.profileImage}` : avatar.src);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchUserData();
  }, []);

  const fullName = `${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`.trim() || "User";

  return (
    <div className="bg-[#7980ff] p-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-2">
          <div className="relative">
            <Image
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
            <P className="text-white text-start">{userData?.firstName ? `Hi ${userData.firstName}, Good Morning!` : "Welcome!"}</P>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div>
            <LeftMenuDrawer/>
          </div>
          <div>
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
    </div>
  );
}
