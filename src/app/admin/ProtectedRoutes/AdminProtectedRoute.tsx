"use client";


import { useEffect, useState } from "react";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const [isHydrated, setIsHydrated] = useState(false);


  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  if (!isHydrated) {
    return <div className="text-center mt-20">Checking authentication...</div>;
  }
  return <>{children}</>;
};

export default AdminProtectedRoute;