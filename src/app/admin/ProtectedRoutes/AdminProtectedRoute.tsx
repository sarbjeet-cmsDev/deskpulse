"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user); 
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);


  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    //  console.log("token in admin protect route--->",token)
    // if (!token || !user || user.role !== 'admin') {
    //   router.replace('/auth/login');
    // }
  }, [user,isHydrated, router]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // if (!token || !user || user.role !== 'admin') {
  //   return <div className="text-center mt-20">Redirecting...</div>;
  // }

  if (!isHydrated) {
    return null; 
  }
  
  if (!isHydrated) {
  return <div className="text-center mt-20">Checking authentication...</div>;
}
  return <>{children}</>;
};

export default AdminProtectedRoute;