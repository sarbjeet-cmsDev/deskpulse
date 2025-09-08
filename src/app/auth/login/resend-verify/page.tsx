import ResendVerifyForm from "@/components/auth/ResendVerifyForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "Resend Verify",
  },
};
export default function index() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ResendVerifyForm />
    </Suspense>
  );
}