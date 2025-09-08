"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../Form/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { workSpaceCreateSchema } from "../validation/workSpace.schema";
import { WorkSpaceService } from "@/service/workSpace.service";
import { Button } from "../Form/Button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useRouter } from "next/navigation";

type CreateWorkSpaceInput = z.infer<typeof workSpaceCreateSchema>;

export const CreateWorkSpace = () => {
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
    const router = useRouter()
    const onSubmit = async (data: CreateWorkSpaceInput) => {
        try {
            await WorkSpaceService.createWorkSpace({ title: data?.title });
            reset()
            router.push('/workSpace/view')
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="flex items-center justify-center h-[calc(100vh-196px)]">
            <Card className="w-full max-w-md rounded-2xl">
                <CardHeader className="flex justify-center">
                    <p className="text-center">
                        Create Workspace
                    </p>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody >
                        <Input
                            {...register("title")}
                            label="Workspace Title"
                            placeholder="Enter workspace name"
                            fullWidth
                            isInvalid={!!errors.title}
                            errorMessage={errors.title?.message}
                        />
                    </CardBody>

                    <CardFooter>
                        <Button
                            type="submit"
                            color="primary"
                            fullWidth
                            className="rounded-xl"
                            isLoading={isSubmitting}
                        >
                            Create
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
