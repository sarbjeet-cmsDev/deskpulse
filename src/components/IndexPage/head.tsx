import Image from "next/image";
import avatar from "@/assets/images/avt1.jpg";
import bell from "@/assets/images/bell.png";
import {H5} from "@/components/Heading/H5";
import {P} from "@/components/ptag"

export default function TopHeader(){
    return(
        <div className="bg-[#7980ff] p-4 ">
            <div className="flex justify-between items-center">
                <div className="flex justify-center items-center gap-2">
                    <div className="relative">
                        <Image src={avatar} alt="avatar-iamge" className="rounded-3xl w-[52px]"/>
                        <span className="dot-status w-[12px] h-[12px] border border-[#7980ff] bg-[#48bd69] rounded-[20px] absolute top-0 right-0"></span>
                    </div>
                    <div>
                        <H5 className="text-white">Jennifer Lyine</H5>
                        <P className="text-white text-start">Hi Jennifer, Good Morning!</P>
                    </div>
                </div>
                <div className="flex justify-center items-center gap-2">
                    <div>
                        <a href="#">
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="1">
                                    <path d="M2.5 10H17.5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.5 5H17.5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.5 15H17.5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </svg>
                        </a>
                    </div>
                    <div>
                    <a href="#" className="box-noti">
                        <Image src={bell} alt="bell-icon" className="invert"/>
                        <span className="dot-danger"></span>
                    </a>
                    </div>
                </div>
            </div>
        </div>
    );
}