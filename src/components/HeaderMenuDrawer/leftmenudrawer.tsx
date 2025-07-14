"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Divider,
} from "@heroui/react";
import { Button } from "../Form/Button";
import Image from "next/image";
import avatar from "@/assets/images/avt1.jpg";
import { H5 } from "@/components/Heading/H5";
import { P } from "@/components/ptag";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { IUserRedux } from "@/types/user.interface";
import Link from "next/link";
import { getGreeting } from "@/utils/greetings";
import { useDispatch } from "react-redux";
import { signOut } from "@/store/slices/authSlice";
import router from "next/router";

export default function LeftMenuDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const [placement, setPlacement] = React.useState<
    "left" | "right" | "top" | "bottom"
  >("left");
  const user: IUserRedux | null = useSelector(
    (state: RootState) => state.auth.user
  );
  const userProfile = useSelector((state: RootState) => state.user.data);
  console.log(user, "useruseruser");
  const [version, setVersion] = useState(Date.now());
  const avatarUrl = userProfile?.profileImage
    ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${userProfile.profileImage}?v=${version}`
    : avatar.src;
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/auth/profile" },
    { label: "My Projects", href: "/project/list" },
    { label: "MY Task", href: "/mytask" },
    { label: "Reminder", href: "/reminder" },
    { label: "Create Reminder", href: "/reminder/create" },
    { label: "Logout", href: "/auth/profile" },
  ];

  const handleLogout = () => {
    dispatch(signOut());
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    router.push("/auth/login");
  };


  const handleOpen = (placement: "left" | "right" | "top" | "bottom") => {
    setPlacement(placement);
    onOpen();
  };

  const fullName =
    `${userProfile?.firstName ?? ""} ${userProfile?.lastName ?? ""}`.trim() ||
    "User";

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {["left"].map((placement) => (
          <Button
            key={placement}
            className="capitalize p-0 bg-transparent min-w-fit min-h-fit"
            onPress={() =>
              handleOpen(placement as "left" | "right" | "top" | "bottom")
            }
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="1">
                <path
                  d="M2.5 10H17.5"
                  stroke="#FFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 5H17.5"
                  stroke="#FFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 15H17.5"
                  stroke="#FFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </Button>
        ))}
      </div>
      <Drawer isOpen={isOpen} placement={placement} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 bg-[#7980ff] text-[#fff]">
                Deskpulse
              </DrawerHeader>
              <DrawerBody>
                <div className="flex justify-start items-center gap-2 my-4">
                  <div className="relative">
                    <Image
                      src={avatarUrl}
                      alt="avatar-iamge"
                      width={100}
                      height={100}
                      className="w-[40px] h-[40px] rounded-full object-cover"
                    />
                    <span className="dot-status w-[12px] h-[12px] border border-[#7980ff] bg-[#48bd69] rounded-[20px] absolute top-0 right-0"></span>
                  </div>
                  <div>
                    <H5 className="text-black">{fullName}</H5>
                    <P className="text-black text-start">
                      {userProfile?.firstName
                        ? `Hi ${userProfile.firstName}, ${getGreeting()}!`
                        : `Welcome!`}
                    </P>
                  </div>
                </div>
                <Divider />
                {menuItems.map((item, index) => (
                  <P
                    key={index}
                    className="text-start font-semibold text-black text-[16px] hover:text-[#7980ff] cursor-pointer transition-colors duration-200"
                    onClick={() => onClose()}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </P>
                ))}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
