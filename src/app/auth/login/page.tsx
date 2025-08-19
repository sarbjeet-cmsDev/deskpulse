import AuthLoginPage from "@/components/auth/Login";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "Login",
  },
};
export default function index() {
  return (
    <Suspense fallback={<div className="p-6">Loading Comments...</div>}>
      <AuthLoginPage />
    </Suspense>
  );
}
