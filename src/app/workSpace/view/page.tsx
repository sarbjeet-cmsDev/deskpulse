import { GetWorkSpaceByUser } from "@/components/WorkSpace/getUserWorkSpace";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: {
        absolute: 'WorkSpace',
    }
}
export default function index() {
    return (
        <GetWorkSpaceByUser />
    )
}