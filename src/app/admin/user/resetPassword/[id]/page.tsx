import ResetPasswordForm from '@/components/admin/User/ResetPasswordForm'
import AdminUserService from '@/service/adminUser.service'
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: Promise<{ id: string }>
}
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { id } = await params
 
  
  const Userdata = await AdminUserService.getUserById(id);
 
 
  return {
    title: {
      absolute:`User | ${Userdata?.firstName}`
    },
  }
}
 
export default async function Page({ params}: Props) {
  const { id } = await params
  return(
    <ResetPasswordForm id={id}/>
  )
}


// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useParams, useRouter } from 'next/navigation';
// import { userResetPasswordSchema } from '@/components/validation/userValidation';
// import { Input } from '@/components/Form/Input';
// import { Button } from '@/components/Form/Button';
// import AdminUserService from '@/service/adminUser.service';
// import Link from "next/link";
// import Image from "next/image";
// import leftarrow from "@/assets/images/back.png";
// import { H3 } from "@/components/Heading/H3";

// type ResetPasswordInput = z.infer<typeof userResetPasswordSchema>;

// interface Props {
//   id: string;
// }

// const ResetPasswordForm = () => {
//   const router = useRouter();
//   const { id } = useParams<{ id: string }>();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<ResetPasswordInput>({
//     resolver: zodResolver(userResetPasswordSchema),
//   });

//   const onSubmit = async (data: ResetPasswordInput) => {
//     try {
//       await AdminUserService.resetPassword(id, data.newPassword);

//       router.push('/admin/user');
//     } catch (err) {
//       console.error('Password reset failed:', err);

//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-start pt-10">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
//       >
//        <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
//         <div className="w-[5%]">
//           <Link href="/admin/user">
//             <Image src={leftarrow} alt="Back" width={30} height={30} />
//           </Link>
//         </div>
//         <H3 className="w-[98%] text-center">Reset Password</H3>
//       </div>

//         <Input
//           type="password"
//           placeholder="New Password"
//           {...register('newPassword')}
//         />
//         {errors.newPassword && (
//           <p className="text-sm text-red-500">{errors.newPassword.message}</p>
//         )}

//         <Input
//           type="password"
//           placeholder="Confirm Password"
//           {...register('confirmPassword')}
//         />
//         {errors.confirmPassword && (
//           <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
//         )}

//         <Button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full btn-primary text-white font-semibold py-2 px-4 rounded"
//         >
//           {isSubmitting ? 'Resetting...' : 'Reset Password'}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default ResetPasswordForm;
