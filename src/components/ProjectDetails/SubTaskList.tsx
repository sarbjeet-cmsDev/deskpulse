"use client";
import { H6 } from "../Heading/H6";
import {Checkbox} from "@heroui/react";
export default function SubTasks(){
    return(
        <div>
            <ul className="mt-[24px]">
                <li className="inactive bg-[#f8fafc] w-full py-[15px] px-[20px] rounded-[8px] border-l-[8px]">
                    <Checkbox color="success" className="flex flex-row-reverse justify-between items-center min-w-full">
                        Define Problem with Client
                    </Checkbox>
                </li>
                <li className="inactive bg-[#f8fafc] w-full py-[15px] px-[20px] rounded-[8px] border-l-[8px] border-l-[#5fd788] mt-[16px]">
                    <Checkbox defaultSelected color="success" className="flex flex-row-reverse justify-between items-center min-w-full">
                        Define Problem with Client
                    </Checkbox>
                </li>
            </ul>
        </div>
    );
}