"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userUpdateSchema } from "@/components/validation/userValidation";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Form/Button";
import { useParams, useRouter } from "next/navigation";
import AdminUserService, { IUser } from "@/service/adminUser.service";
import Link from "next/link";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";

interface Props {
  id: string;
}


type UpdateUserInput = z.infer<typeof userUpdateSchema>;

const UpdateUserPage = ({ id }: Props) => {
  const router = useRouter();
  // const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(userUpdateSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AdminUserService.getUserById(id);
        reset({
          username: user.username ?? "",
          email: user.email ?? "",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          phone: user.phone ?? "",
          gender: ["male", "female", "other"].includes(user.gender || "")
            ? (user.gender as "male" | "female" | "other")
            : undefined,
          roles: user.roles ?? [],
          isActive: user.isActive ?? false,
        });
      } catch (err) {
        console.error("Failed to fetch user", err);
        router.push("/admin/user");
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id, reset, router]);

  const onSubmit = async (data: UpdateUserInput) => {
    setLoading(true);
    try {
      await AdminUserService.updateUser(id, data);

      router.push("/admin/user");
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-6">Loading user...</div>;

  return (
    <div className="min-h-screen flex justify-center items-start pt-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl bg-white p-6 rounded shadow space-y-4"
      >
        <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[5%]">
          <Link href="/admin/user">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
        </div>
        <H3 className="w-[98%] text-center">Update User</H3>
      </div>

        <Input placeholder="Username" {...register("username")} />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}

        <Input type="email" placeholder="Email" {...register("email")} readOnly />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}

        <Input placeholder="First Name" {...register("firstName")} />
        {errors.firstName && (
          <p className="text-sm text-red-500">{errors.firstName.message}</p>
        )}
        <Input placeholder="Last Name" {...register("lastName")} />
        {errors.lastName && (
          <p className="text-sm text-red-500">{errors.lastName.message}</p>
        )}
        <Input placeholder="Phone" {...register("phone")} />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
        {/* Gender Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            {...register("gender")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        {/* User Roles Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Roles
          </label>
          <select
            multiple
            {...register("roles")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          {errors.roles && (
            <p className="text-sm text-red-500">{errors.roles.message}</p>
          )}
        </div>

        {/* isActive Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("isActive")}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">Is Active</label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full btn-primary text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Updating..." : "Update User"}
        </Button>
      </form>
    </div>
  );
};

export default UpdateUserPage;
