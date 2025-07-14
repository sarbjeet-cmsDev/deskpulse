"use client";

import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import defaultAvatar from "@/assets/images/avt1.jpg";
import { H5 } from "@/components/Heading/H5";
import DrawerFunction from "@/components/drawer";
import { P } from "@/components/ptag";
import { Button } from "@/components/Form/Button";
import FullDrawerPage from "@/components/FullDrawer";
import ModalDiv from "@/components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/store/store";
import { fetchUserProfile, updateUserAvatar } from "@/store/slices/userSlice";
import Link from "next/link";

export default function AuthProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.data);
  const [version, setVersion] = useState<number>(Date.now()); // 👈 tracks cache-busting version

  const handleLogout = () => {
    dispatch(signOut());
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    router.push("/auth/login");
  };

  const handleAvatarChange = async (file: File) => {
    try {
      await dispatch(updateUserAvatar(file)).unwrap();
      setVersion(Date.now()); // 👈 Trigger new image version after upload
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const avatarUrl = user?.profileImage
    ? `${process.env.NEXT_PUBLIC_BACKEND_HOST}${user.profileImage}?v=${version}`
    : defaultAvatar.src;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[2%]">
          <Link href="/">
            <Image src={leftarrow} alt="Logo" width={16} height={16} />
          </Link>
        </div>
        <H5 className="w-[98%] text-center">Profile</H5>
      </div>
      <div className="mt-[24px] px-[24px]">
        <div className="flex justify-center items-center flex-col gap-2">
          <div className="relative">
            <Image
              key={avatarUrl} // 👈 force Image re-render when avatarUrl changes
              src={avatarUrl}
              alt="avatar"
              width={100}
              height={100}
              className="w-[100px] h-[100px] rounded-full object-cover"
              priority
            />
            <div className="absolute right-0 bottom-0">
              <DrawerFunction onImageSelect={handleAvatarChange} />
            </div>
          </div>
          <H5>{user?.username}</H5>
          <P className="mt-[-10px]">{user?.email}</P>
          <Button
            className="text-white bg-[#7980ff] p-[25px] mt-[10px] text-[14px] leading-[16px] font-bold w-full"
            onClick={() => {
              if (user?._id) {
                router.push(`/auth/profile/update/${user._id}`);
              }
            }}
          >
            Edit Profile
          </Button>
          <FullDrawerPage />
          <ModalDiv onLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
}
