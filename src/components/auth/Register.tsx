"use client";

import { useForm,Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authCreateSchema, userCreateSchema } from "@/components/validation/userValidation";
import { z } from "zod";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";
import AuthService from "@/service/auth.service";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type CreateUserInput = z.infer<typeof authCreateSchema>;

const AuthRegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(authCreateSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      gender: undefined,
      roles: "user",
    },
  });

  const onSubmit = async (data: CreateUserInput) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;

      await AuthService.create(payload);

      router.push("/auth/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10 my-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl bg-white p-6 rounded shadow space-y-4"
      >
        <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
          <Link href="/auth/login">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>

          <H3 className="text-center flex-1">Sign Up</H3>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <Input placeholder="Username" {...register("username")} />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input type="email" placeholder="Email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <Input placeholder="First Name" {...register("firstName")} />
        {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <Input placeholder="Last Name" {...register("lastName")} />
        {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        {/* <Input placeholder="Phone" {...register("phone")} />
        {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
        )} */}

        <Controller
        name="phone"
        control={control}
        rules={{ required: "Phone is required" }}
        render={({ field, fieldState }) => (
          <div>
            <PhoneInput
              country="in"
              value={field.value}
              onChange={field.onChange}
              inputProps={{
                name: "phone",
                required: true,
              }}
              inputStyle={{ width: "100%", backgroundColor:"#f7f7f7", }}
            />
            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <Input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full btn-primary text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Sign Up..." : "Sign Up"}
        </Button>

        <div className="text-sm text-gray-600">
            If you already have an account?{' '}
            <Link href="/auth/login" className="link-primary">
              SignIn Here
            </Link>
          </div>
      </form>
    </div>
  );
};

export default AuthRegisterPage;