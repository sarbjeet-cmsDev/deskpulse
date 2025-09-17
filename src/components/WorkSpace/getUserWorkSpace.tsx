"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { WorkSpaceService } from "@/service/workSpace.service";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { Input } from "../Form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteMemberSchema, workSpaceCreateSchema } from "../validation/workSpace.schema";
import { z } from "zod";
import { Button } from "../Form/Button";
import { GiShare } from "react-icons/gi";
import { CommonModal } from "../common/Modal/Modal";
import { useRouter } from "next/navigation";
type CreateWorkSpaceInput = z.infer<typeof workSpaceCreateSchema>;

type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const GetWorkSpaceByUser = () => {
    const userData: any = useSelector((state: RootState) => state.auth.user);
    const [getWorkSpace, setGetWorkSpace] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [shareWorkspace, setShareWorkspace] = useState<any | null>(null);

    const fetchWorkSpace = async () => {
        try {
            const result: any = await WorkSpaceService.getWorkSpaceByUserdID(
                userData?._id || userData?.id
            );
            setGetWorkSpace(result?.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchWorkSpace();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await WorkSpaceService.deleteWorkSpace(id);
            setGetWorkSpace((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateWorkSpaceInput>({
        resolver: zodResolver(workSpaceCreateSchema),
        defaultValues: {
            title: "",
        },
    });

    const onSubmit = async (data: CreateWorkSpaceInput) => {
        if (!editingId) return;
        try {
            await WorkSpaceService.updateWorkSpace(editingId, { title: data.title });
            setGetWorkSpace((prev) =>
                prev.map((item) =>
                    item._id === editingId ? { ...item, title: data.title } : item
                )
            );
            setEditingId(null);
            reset();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (item: any) => {
        setEditingId(item._id);
        reset({ title: item.title });
    };

    const {
        register: inviteRegister,
        handleSubmit: handleInviteSubmit,
        reset: resetInvite,
        formState: { errors: inviteErrors, isSubmitting: isInviteSubmitting },
    } = useForm<InviteMemberInput>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: "",
            role: "user",
        },
    });

    const onInviteSubmit = async (data: InviteMemberInput) => {
        if (!shareWorkspace?._id) return;
        const params: any = { email: data?.email, userType: data?.role }
        try {
            await WorkSpaceService.shareWorkSpace(shareWorkspace?._id, params)
            resetInvite();
            setShareWorkspace(null);
        } catch (error) {
            console.log(error);
        }
    };
    const router = useRouter()
    return (
        <div className="px-4 py-6">
            <p className="mb-6 text-center font-semibold text-lg">My Workspaces</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getWorkSpace?.map((item: any) => (
                    <Card key={item?._id} shadow="sm" className="rounded-2xl cursor-pointer" >
                        <CardHeader className="font-medium">
                            {editingId === item._id ? (
                                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                                    <Input
                                        {...register("title")}
                                        variant="bordered"
                                        fullWidth
                                        isInvalid={!!errors.title}
                                        errorMessage={errors.title?.message}
                                        autoFocus
                                    />
                                </form>
                            ) : (
                                <div className="flex justify-between w-full">
                                    <p>{item?.title}</p>
                                    <GiShare
                                        className="cursor-pointer"
                                        onClick={() => setShareWorkspace(item)}
                                    />
                                </div>
                            )}
                        </CardHeader>

                        <CardBody onClick={() => router?.push(`/workSpace/${item?._id}`)}>
                            <p className="text-gray-500">Workspace ID: {item?._id}</p>
                        </CardBody>

                        <CardFooter className="flex justify-end gap-2">
                            {editingId === item._id ? (
                                <>
                                    <Button
                                        size="sm"
                                        color="primary"
                                        isLoading={isSubmitting}
                                        onClick={handleSubmit(onSubmit)}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        color="default"
                                        onPress={() => {
                                            setEditingId(null);
                                            reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button size="sm" variant="flat" onPress={() => handleEdit(item)}>
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="danger"
                                        onPress={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                ))}
                {shareWorkspace && (
                    <CommonModal
                        title="Share WorkSpace"
                        isOpen={!!shareWorkspace}
                        onClose={() => setShareWorkspace(null)}
                    >
                        <form
                            onSubmit={handleInviteSubmit(onInviteSubmit)}
                            className="space-y-4"
                        >
                            <Input
                                type="email"
                                label="Email"
                                {...inviteRegister("email")}
                                isInvalid={!!inviteErrors.email}
                                errorMessage={inviteErrors.email?.message}
                            />

                            <select
                                {...inviteRegister("role")}
                                className="border p-2 rounded w-full"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {inviteErrors.role && (
                                <p className="text-red-500 text-sm">{inviteErrors.role.message}</p>
                            )}

                            <Button
                                type="submit"
                                color="primary"
                                fullWidth
                                isLoading={isInviteSubmitting}
                            >
                                Invite
                            </Button>
                        </form>


                    </CommonModal>
                )}
            </div>
        </div>
    );
};
