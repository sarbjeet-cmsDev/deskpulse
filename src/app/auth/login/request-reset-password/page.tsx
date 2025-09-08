import RequestResetPasswordForm from "@/components/auth/RequestResetPassForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "Request Reset password",
  },
};
export default function index() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <RequestResetPasswordForm />
    </Suspense>
  );
}