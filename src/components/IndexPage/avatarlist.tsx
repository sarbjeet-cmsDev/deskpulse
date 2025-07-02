import Image from "next/image";
import avatar from "@/assets/images/avt1.jpg";

export default function AvatarList(){
    return(
        <div>
            <ul className="list-stacked flex items-center">
                <li className="avt-list">
                    <div className="avatar avt-27 round">
                        <Image src={avatar} alt="avatar-image" className=" w-[25px] h-[25px] rounded-[30px]"/>
                    </div>
                </li>
                <li className="avt-list ml-[-4px]">
                    <div className="avatar avt-27 round">
                        <Image src={avatar} alt="avatar-image" className=" w-[25px] h-[25px] rounded-[30px]"/>
                    </div>
                </li>
                <li className="avt-list ml-[-4px]">
                    <div className="avatar avt-27 round">
                        <Image src={avatar} alt="avatar-image" className=" w-[25px] h-[25px] rounded-[30px]"/>
                    </div>
                </li>
            </ul>
        </div>
    );  
}