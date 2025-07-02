
'use client';

import CreateTaskModal from '@/components/Task/createTaskModel';
import TaskService from '@/service/task.service';
import { H1 } from '@/components/Heading/H1';


export default function TaskPage() {
  const handleCreateTask = async (title: string) => {
    try {
      await TaskService.createTask({
        title,
        project: '6863ba829d884a3f13d5610c',
        report_to: '6863aede9d884a3f13d56100'
      });
  
    } catch (error) {
      console.error(error);

    }
  };

  return (
    <div className="p-6">
      {/* <H1 className="text-xl font-bold mb-4">Task Management</H1> */}

      <CreateTaskModal onCreate={handleCreateTask} />
    </div>
  );
}
