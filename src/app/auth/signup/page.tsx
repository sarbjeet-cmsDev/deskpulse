import AuthRegisterPage from "@/components/auth/Register";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "Signup",
  },
};
export default function index() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AuthRegisterPage />
    </Suspense>
  );
}