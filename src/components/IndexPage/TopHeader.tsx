"use client";

import Image from "next/image";
import bell from "@/assets/images/bell.png";
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
import { GlobalSearch } from "../global-search/GlobalSearch";
import { searchAll } from "@/service/searchService";
import { getSocket } from "@/utils/socket";
import { fetchNotificationCount } from "@/store/slices/NotificationSlice";
export default function TopHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const user: any = useSelector((state: RootState) => state.user.data);
  const userData: any = useSelector((state: RootState) => state.auth.user);

  const { count } = useSelector(
    (state: RootState) => state.notification
  );
  useEffect(() => {
    if (user?._id || user?.id) {
      dispatch(fetchNotificationCount(user?._id || user?.id));
    }
  }, [user?._id || user?.id, dispatch]);
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
    const socket = socketRef.current;
    if (!socket || !userData?.id) return;

    if (!socket.connected) {
      socket.connect();
    }


    const registerUser = () => {
      socket.emit("register-user", userData.id);
      console.log("User registered again:", userData.id);
    };

    socket.on("connect", registerUser);

    const handleNotification = ({
      message,
      taskId,
    }: {
      message: string;
      taskId: string;
    }) => {
      if (Notification.permission === "granted") {
        new Notification("Notification Received", {
          body: message,
          icon: "/bell.png",
        });
      }
      if (userData?._id || userData?.id) {
        dispatch(fetchNotificationCount(userData?._id || userData?.id));
      }
    };

    socket.on("receive-notification", handleNotification);
    if (userData?._id || userData?.id) {
      dispatch(fetchNotificationCount(userData?._id || userData?.id));
    }

    return () => {
      socket.off("connect", registerUser);
      socket.off("receive-notification", handleNotification);
    };
  }, [userData?.id, dispatch]);

  useEffect(() => {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }
  }, []);

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
              {count > 0 && (
                <span className="absolute -top-3 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 h-5 min-w-[1.25rem] flex items-center justify-center">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </div>
          </div>
          <CommonDrawer type="notification" className="leftmenuDrawer">
            <NotificationDrawer />
          </CommonDrawer>
        </div>
      </div>
    </div>
  );
}
