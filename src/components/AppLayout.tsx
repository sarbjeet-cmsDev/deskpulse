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
      <div className="flex flex-col min-h-screen text-sm md:text-base">
        <div className="sticky top-0 z-50">
          <TopHeader />
        </div>
        <main className="pt-6 px-4 md:px-8 lg:px-10 flex-grow mb-10">{children}</main>
        <footer className="w-full flex items-center justify-center py-4 bg-theme-primary text-white text-xs sm:text-sm">
          <Link
            // isExternal
            className="flex items-center gap-1 text-current"
            href="#"
            title="bronzebyte"
          >
            <p className="text-white">
              © {new Date().getFullYear()} copyright all rights reserved
            </p>
          </Link>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
