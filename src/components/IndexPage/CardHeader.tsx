import bellicon from "@/assets/images/bell.png";
import Image from "next/image";
import { H6 } from "../Heading/H6";


interface CardHeadProps {
    title: string;
}

export default function CardHead({ title }: CardHeadProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] bg-[#26ab3f] rounded-[50%] flex justify-center items-center">
                <Image src={bellicon} alt="bell-icon" className="w-[18px] h-[18px]" />
            </div>
            <H6 className="flex-grow">{title}</H6>
        </div>
    );
}