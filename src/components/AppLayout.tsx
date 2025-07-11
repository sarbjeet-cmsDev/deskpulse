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
      <div className="sticky top-0 z-50">
        <TopHeader />
      </div>
      <main className="pt-16 px-6 flex-grow">{children}</main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com?utm_source=next-app-template"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </Link>
      </footer>
    </ProtectedRoute>
  );
}
