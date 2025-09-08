"use client";
import UserService from "@/service/user.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const WorkSpaceInvite = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const workspaceId = searchParams.get("workspaceId") ?? "";
    const email = searchParams.get("email") ?? "";
    const role = searchParams.get("role") ?? "";
    useEffect(() => {
        if (!email || !workspaceId) return;
        async function checkUser() {
            try {
                const res: any = await UserService.checkUser(email);

                if (res?.exists === true) {
                    window.location.href = `/auth/login?workspaceId=${workspaceId}&email=${email}&role=${role}`
                } else {
                    window.location.href = `/auth/signup?workspaceId=${workspaceId}&email=${email}&role=${role}`
                }
            } catch (error) {
                console.error("Error checking user", error);
            }
        }

        checkUser();
    }, [email, workspaceId, router]);

    return <p>Checking invitation...</p>;
};
