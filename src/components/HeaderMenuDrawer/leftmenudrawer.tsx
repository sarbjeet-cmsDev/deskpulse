"use client";
import React, { useEffect, useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getSocket } from "@/utils/socket";
import { MenuIcon } from "../icons";

export default function LeftMenuDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const userData = useSelector((state: RootState) => state.user.data);
  const dispatch = useDispatch<AppDispatch>();
  const [placement, setPlacement] = React.useState<
    "left" | "right" | "top" | "bottom"
  >("right");
  const user: IUserRedux | null = useSelector(
    (state: RootState) => state.auth.user
  );

  const [imageSrc, setImageSrc] = useState<string>(avatar.src);

  const userProfile = useSelector((state: RootState) => state.user.data);

  const [version, setVersion] = useState(Date.now());

  useEffect(() => {
    if (userData?.profileImage) {
      setImageSrc(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}${userData.profileImage}?v=${version}`
      );
    } else {
      setImageSrc(avatar.src);
    }
  }, [userData, version]);

  const userMenuItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/auth/profile" },
    { label: "My Projects", href: "/project/list" },
    { label: "My Task", href: "/mytask" },
    { label: "Calender", href: "/calender" },
    { label: "Reminder", href: "/reminder" },
    { label: "Create Reminder", href: "/reminder/create" },
    { label: "My Timesheet", href: "/timesheet" },
    { label: "My Performance", href: "/performance" },
    { label: "Logout", href: "#" },
  ];

  const adminMenuItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/auth/profile" },
    { label: "Projects", href: "/admin/project" },
    { label: "Users", href: "/admin/user" },
    { label: "Tasks", href: "/admin/task" },
    { label: "Notifications", href: "/admin/notification" },
    { label: "Comments", href: "/admin/comment" },
    { label: "Calender", href: "/calender" },
    // { label: "Workspace", href: "/workSpace/view" },
    // { label: "Create Workspace", href: "/workSpace" },
    { label: "Performance", href: "/admin/performance" },
    { label: "Time Sheet", href: "/admin/timesheet" },
    { label: "Create Reminder", href: "/reminder/create" },
    { label: "My Reminder", href: "/reminder" },
    { label: "Logout", href: "#" },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;

  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    const socket = getSocket();
    socket.disconnect();
    dispatch(signOut());
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    localStorage.removeItem("taskView");
    localStorage.removeItem("isCientAcceptanceColor");
    localStorage.removeItem("priortiyactiveColor");
    Cookies.remove("token");
    Cookies.remove("role");
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
      <div className="flex flex-wrap gap-3" >
        {["right"].map((placement) => (
          <Button
            key={placement}
            className="capitalize p-0 bg-transparent min-w-fit min-h-fit"
            onPress={() =>
              handleOpen(placement as "left" | "right" | "top" | "bottom")
            }
          >
            <MenuIcon />
          </Button>
        ))}
      </div>
      <Drawer isOpen={isOpen} placement={placement} onOpenChange={onOpenChange} className="leftmenuDrawer">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 bg-theme-primary text-[#fff]" >
                Deskpulse
              </DrawerHeader>
              <DrawerBody>
                <div className="flex justify-start items-center gap-2 my-4">
                  <div className="relative">
                    <Image
                      src={imageSrc}
                      alt="avatar-iamge"
                      onError={() => setImageSrc(avatar.src)}
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
                {menuItems.map((item, index) =>
                  item.label === "Logout" ? (
                    <P
                      key={index}
                      className="text-start px-4 py-2 bg-white font-semibold text-red-500 text-[16px] border border-none rounded-md hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-500"
                      onClick={() => {
                        onClose();
                        handleLogout();
                      }}
                    >
                      {item.label}
                    </P>
                  ) : (
                    <Link href={item.href} key={index} passHref>
                      <P
                        className={`text-start px-4 py-2 font-semibold text-[16px] border border-none rounded-md cursor-pointer transition-colors duration-500
                ${pathname === item.href
                            ? "bg-blue-500 text-white"
                            : "bg-white text-black hover:bg-[#7980ff] hover:text-white"
                          }`}
                        onClick={onClose}
                      >
                        {item.label}
                      </P>
                    </Link>
                  )
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
