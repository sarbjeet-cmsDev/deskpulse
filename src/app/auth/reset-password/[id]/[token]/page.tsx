import ResetPasswordForm from "@/components/admin/User/ResetPasswordForm";
import AuthResetPasswordForm from "@/components/auth/AuthPasswordResetForm";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string , token:string}>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: {
      absolute: `Reset Password`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id, token } = await params;
  return <AuthResetPasswordForm id={id} token={token} />;
}
