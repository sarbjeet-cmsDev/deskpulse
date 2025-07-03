"use client";

import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import avatar from "@/assets/images/avt1.jpg";
import { H5 } from "@/components/Heading/H5";
import DrawerFunction from "@/components/drawer";
import { P } from "@/components/ptag";
import { Button } from "@/components/Form/Button";
import FullDrawerPage from "@/components/FullDrawer";
import ModalDiv from "@/components/Modal";
import { useDispatch } from "react-redux";
import { signOut } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserService from "@/service/user.service";
import { IUser } from "@/service/user.service";

export default function AuthProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  console.log('user----------ggggggggggg ',user)
  console.log('avatarUrl--------------- ',avatarUrl)
  const handleLogout = () => {
    dispatch(signOut());
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    router.push("/auth/login");
  };

  const handleAvatarChange = async(file: File) => {
    try {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      const data = await UserService.uploadAvatar(file);
      console.log('data when upload avtar ',data)
      setUser(data); 
      
    } catch (error) {
       console.error("Image upload failed:", error);
    }
};

  useEffect(()=>{
    const FetchUser = async () => {
      try {
        const data = await UserService.getUserById();
        setUser(data);
        setAvatarUrl(`${process.env.NEXT_PUBLIC_BACKEND_HOST}${data.profileImage}`);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
      }
    };

    FetchUser();
  },[])
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[2%]">
          <a href="/">
            <Image src={leftarrow} alt="Logo" width={16} height={16} />
          </a>
        </div>
        <H5 className="w-[98%] text-center">Profile</H5>
      </div>
      <div className="mt-[24px] px-[24px]">
        <div className="flex justify-center items-center flex-col gap-2">
          <div className="relative">
            <Image src={avatarUrl ?? avatar} alt="avatar"  width={100} height={100} className="w-[100px] h-[100px] rounded-full object-cover" />
            <div className="absolute right-0 bottom-0">
              <DrawerFunction onImageSelect={handleAvatarChange} />
            </div>
          </div>
          <H5>{user?.username}</H5>
          <P className="mt-[-10px]">{user?.email}</P>
          <Button className="text-white bg-[#7980ff] p-[25px] mt-[10px] text-[14px] leading-[16px] font-bold w-full" 
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
