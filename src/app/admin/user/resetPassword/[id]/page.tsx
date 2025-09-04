import ResetPasswordForm from "@/components/admin/User/ResetPasswordForm";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
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
  const { id } = await params;
  return <ResetPasswordForm id={id} />;
}
