"use client";

import Image from "next/image";
import bell from "@/assets/images/bell.png";
import { Button } from "@heroui/button";
import { useRef } from "react";
import { openDrawer } from "@/store/slices/drawerSlice";
import { useDispatch, useSelector } from "react-redux";
import { CommonDrawer } from "../common/Drawer/Drawer";
import { NotificationDrawer } from "../Notification/Notification";
import { AppDispatch, RootState } from "@/store/store";
import { useState, useEffect } from "react";
import LeftMenuDrawer from "../HeaderMenuDrawer/leftmenudrawer";
import { fetchUserProfile } from "@/store/slices/userSlice";
import { H3 } from "../Heading/H3";
import Link from "next/link";
import { Input } from "../Form/Input";
import { GlobalSearch } from "../global-search/GlobalSearch";
import { searchAll } from "@/service/searchService";
import { P } from "../ptag";
import NotificationService from "@/service/notification.service";
import { NotifyNotifications } from "../Notification/NotifyNotification";
import { getSocket } from "@/utils/socket"; 
// import {}"../../../src/assets/images"
export default function TopHeader() {
  // console.log(notificationCount,"notificationCountnotificationCount")
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const user: any = useSelector((state: RootState) => state.user.data);
  const userData: any = useSelector((state: RootState) => state.auth.user);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token]);
  const [version, setVersion] = useState(Date.now());

  useEffect(() => {
    if (user?.profileImage) {
      setVersion(Date.now());
    }
  }, [user?.profileImage]);

 
  const socketRef = useRef(getSocket());

  
useEffect(() => {
  if (!userData?.id) return;

  const socket = socketRef.current;
  if (!socket) return;

  const fetchNotification = async () => {
    try {
      const res: any = await NotificationService.getNotificationByUserId(userData.id);
      setNotificationCount(res?.notifications?.count || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleNotification = ({ message, taskId }: { message: string; taskId: string }) => {
    if (Notification.permission === "granted") {
      new Notification("Notification Received", {
        body: message,
        icon: "/bell.png",
      });
    }

    fetchNotification();
  };

  socket.on("receive-notification", handleNotification);

  fetchNotification();

  return () => {
    socket.off("receive-notification", handleNotification);
  };
}, [userData?.id]);

useEffect(() => {
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}, []);
  



  // NotifyNotifications(10000)

  return (
    <div className="bg-theme-primary px-4 py-4">
      <div className="flex flex-row md:justify-between md:items-center gap-5">
        <div className="flex items-center gap-2">
          <H3 className="text-2xl text-white">
            <Link href={"/"}>Deskpulse</Link>{" "}
          </H3>
        </div>
        <div className="w-full md:w-[350px] lg:w-[500px] xl:w-[470px]">
          <GlobalSearch placeholder="Search" fetcher={searchAll} />
        </div>
        <div className="flex justify-center items-center gap-6 shrink-0">
          <LeftMenuDrawer />
          <div
            
            onClick={() =>
              dispatch(openDrawer({ size: "md", type: "notification" }))
            }
          >
            <div className="relative cursor-pointer">
              <Image
                src={bell}
                alt="notification"
                className="cursor-pointer invert"
              />
              {notificationCount > 0 && (
                <span className="absolute -top-3 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 h-5 min-w-[1.25rem] flex items-center justify-center">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </div>
          </div>
          <CommonDrawer type="notification">
            <NotificationDrawer />
          </CommonDrawer>
        </div>
      </div>
    </div>
  );
}
