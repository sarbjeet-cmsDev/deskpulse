"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectRoutes/ProtectedRoute";
import TopHeader from "@/components/IndexPage/TopHeader";
import { Link } from "@heroui/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();


  const hideLayout = pathname.startsWith("/auth/login");

  if (hideLayout) {
    return <main>{children}</main>; 
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <TopHeader />
      </div>
      <main className="pt-16 px-6 flex-grow mb-10">{children}</main>
      <footer className="w-full flex items-center justify-center py-3 bg-theme-primary text-white">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="#"
          title="bronzebyte"
        >
          <p className="text-white">© 2025 copyright all rights reserved</p>
        </Link>
      </footer>
      </div>
    </ProtectedRoute>
  );
}
