"use client";

import Image from "next/image";
import bell from "@/assets/images/bell.png";
import { Button } from "@heroui/button";
import { openDrawer } from "@/store/slices/drawerSlice";
import { useDispatch, useSelector } from "react-redux";
import { CommonDrawer } from "../common/Drawer/Drawer";
import { Notification } from "../Notification/Notification";
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

export default function TopHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.data);

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
          <P
            // variant="light"
            onClick={() =>
              dispatch(openDrawer({ size: "md", type: "notification" }))
            }
          >
            <Image src={bell} alt="notification" className="cursor-pointer invert" />
          </P>
          <CommonDrawer type="notification">
            <Notification />
          </CommonDrawer>
        </div>
      </div>
    </div>
  );
}
