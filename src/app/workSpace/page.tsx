import { CreateWorkSpace } from "@/components/WorkSpace/createWorkSpace";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        absolute: 'WorkSpace',
    }
}
export default function index() {
    return (
        <CreateWorkSpace />
    )
}