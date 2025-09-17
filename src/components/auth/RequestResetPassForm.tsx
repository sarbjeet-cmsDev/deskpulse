"use client";

import AuthService from "@/service/auth.service";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "../Heading/H3";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailValidationSchema } from "../validation/userValidation";
import { Button } from "@/components/Form/Button";
import { Input } from "@/components/Form/Input";

type EmailInput = z.infer<typeof MailValidationSchema>;

export default function RequestResetPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailInput>({
    resolver: zodResolver(MailValidationSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailInput) => {

    setLoading(true);

    try {
      await AuthService.requestResetPassword(data.email);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[260px] flex items-center justify-center">
      <div className="bg-white text-black p-8 rounded-2xl shadow-lg w-[400px]">
        <div className="flex justify-center items-center py-[24px] border-b border-[#31394f14] mb-5">
          <Link href="/auth/login">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
          <H3 className="text-center flex-1">Reset Password</H3>
        </div>

        {submitted ? (
          <p className="text-gray-700 text-sm">
            If this email is registered, a reset link has been sent to your email. Please check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary font-semibold py-2 rounded-md cursor-pointer"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
