"use client";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchemaBaseUpdate } from "@/components/validation/userValidation";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";
import AdminUserService from "@/service/adminUser.service";
import UserService from "@/service/user.service";
import { H3 } from "@/components/Heading/H3";
import { PhoneInputField } from "@/components/Form/PhoneInputField";

interface Props {
  id: string;
}

type UpdateUserInput = z.infer<typeof userSchemaBaseUpdate>;

const UpdateAuthProfileForm = ({ id }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(userSchemaBaseUpdate),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await UserService.getUserById();

        const defaultDateOfBirth = user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "";
        reset({
          username: user.username ?? "",
          email: user.email ?? "",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          phone: user.phone ?? "",
          gender: ["male", "female", "other"].includes(user.gender || "")
            ? (user.gender as "male" | "female" | "other")
            : undefined,
          isActive: user.isActive ?? false,
          aboutUs: user.aboutUs ?? "",
          jobTitle: user.jobTitle ?? "",
          department: user.department ?? "",
          managerId: user.managerId ?? "",
          languagePreference: user.languagePreference ?? "",
          address: user.address ?? "",
          city: user.city ?? "",
          state: user.state ?? "",
          country: user.country ?? "",
          zipCode: user.zipCode ?? "",
          dateOfBirth: defaultDateOfBirth,
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
      router.push("/auth/profile");
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-6">Loading user...</div>;

  return (
    <div className="min-h-screen mx-auto container max-w-3xl flex-col justify-center items-start p-2 md:pt-10">
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full bg-white p-6 rounded shadow space-y-4"
        >
          <div className="flex justify-center items-center md:p-[24px] p-2 border-b border-[#31394f14]">
            <div className="w-10 cursor-pointer">
              <span onClick={() => router.back()}>
                <Image src={leftarrow} alt="Back" width={16} height={16} />
              </span>
            </div>
            <H3 className="w-[98%] text-center">Update Profile</H3>
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
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
            readOnly
          />
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

          <PhoneInputField name="phone" control={control} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              {...register("gender")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <Input placeholder="Address" {...register("address")} />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <Input placeholder="City" {...register("city")} />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <Input placeholder="State" {...register("state")} />
          {errors.state && (
            <p className="text-sm text-red-500">{errors.state.message}</p>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <Input placeholder="Country" {...register("country")} />
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country.message}</p>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code
          </label>
          <Input placeholder="Zip Code" {...register("zipCode")} />
          {errors.zipCode && (
            <p className="text-sm text-red-500">{errors.zipCode.message}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <Input
              type="date"
              {...register("dateOfBirth")}
              className="w-full border border-gray-300 rounded px-3 py-2"
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              onClick={(e) => e.preventDefault()}
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
    </div>
  );
};

export default UpdateAuthProfileForm;
