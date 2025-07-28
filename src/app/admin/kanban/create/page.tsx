import { CreateKanbanList } from "@/components/KanbanBoard/CreateKanbanList";
export const metadata = {
  title: {
    absolute: "Project | Create Kanban",
  }
};
export default function index() {
  return <CreateKanbanList />;
}
