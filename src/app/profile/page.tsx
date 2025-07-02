"use client";

import { H1 } from "@/components/Heading/H1";
import ModalDiv from "@/components/Modal";
import { useDispatch } from "react-redux";
import { signOut } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(signOut());
    localStorage.removeItem("token");
    localStorage.removeItem('type');
    router.push("/auth/login");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <H1 className="mb-6">Profile</H1>
      <ModalDiv onLogout={handleLogout} />
    </div>
  );
}