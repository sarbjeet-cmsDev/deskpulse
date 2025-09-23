"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema } from "@/components/validation/userValidation";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/Form/Button";
import { Input } from "@/components/Form/Input";
import { H3 } from "@/components/Heading/H3";
import AuthService from "@/service/auth.service";
import { WorkSpaceService } from "@/service/workSpace.service";
import { signIn } from "@/store/slices/authSlice";
import Cookies from "js-cookie";
import Link from "next/link";

type LoginInput = z.infer<typeof userLoginSchema>;

export default function AuthLoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const workspaceId = searchParams.get("workspaceId");
  const invitedEmail: any = searchParams.get("email");
  const role: any = searchParams.get("role");
  const emailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: invitedEmail,
      password: "",
    },
  });

  const onSubmit = async (formData: LoginInput) => {
    setLoading(true);

    try {
      const data = await AuthService.login(formData);
      const { access_token, user } = data;
      const role = user.role[0];
      localStorage.setItem("token", access_token);
      Cookies.set("token", access_token, { expires: 1, path: "/" });
      Cookies.set("role", role, { expires: 1, path: "/" });
      localStorage.setItem("type", role);
      dispatch(signIn({ id: user.id, email: user.email, role }));
      if (workspaceId && invitedEmail) {
        try {
          await WorkSpaceService.acceptInvite(workspaceId, {
            email: invitedEmail,
            workspaceId: workspaceId,
            role: role
          });
          router.push(`/workSpace/${workspaceId}`);
          return;
        } catch (err) {
          console.error("Error accepting invite:", err);
          return;
        }
      }
      if (role === "admin") {
        router.push("/");
      } else if (redirect) {
        router.push(`/${redirect}`);
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg shadow-lg px-4 py-12 space-y-6">
        <div className="flex justify-center items-center p-5 border-b border-[#31394f1]">
          <H3 className="w-[98%] text-center">Sign In</H3>
        </div>
        <p className="text-center text-sm text-gray-500">
          Give credentials to sign in your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("email")}
            type="text"
            placeholder="Type your email"
            disabled={invitedEmail}
          // ref={emailRef}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}

          <div className="relative">
            <Input
              {...register("password")}
              placeholder="Type your password"
              type="password"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}

          {/* <div className="text-sm text-gray-600">
            <Link href="/auth/login/resend-verify" className="link-primary">
              Click to resend the verification email
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            Forgot your password?{" "}
            <Link
              href="/auth/login/request-reset-password"
              className="link-primary"
            >
              Reset Password
            </Link>
          </div> */}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 text-white hover:bg-indigo-600"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* <div className="text-sm text-gray-600">
            If you don't have an account?{" "}
            <Link href="/auth/signup" className="link-primary">
              SignUp Here
            </Link>
          </div> */}
        </form>
      </div>
    </div>
  );
}
