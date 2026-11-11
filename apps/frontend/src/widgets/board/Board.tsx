import { useState } from "react";
import { useGetTasksQuery } from "../../entities/task";
import { CreateTaskForm } from "../../features/create-task/CreateTaskForm";
import { Button, Modal, TaskCard } from "../../shared/ui";
import { TASK_COLUMNS } from "../../entities/task/config";

export const Board = () => {
  const { data: tasks, isLoading, isError } = useGetTasksQuery();
  const [showModal, setShowModal] = useState(false);

  if (isLoading)
    return <div className="p-10 text-center">Loading tasks...</div>;
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">
        Loading error (check the token)
      </div>
    );

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 w-50">
        <Button onClick={() => setShowModal(true)} isLoading={false}>
          Add task
        </Button>
      </div>
      <div className="flex gap-6 items-start overflow-x-auto">
        {TASK_COLUMNS.map((col) => (
          <div
            key={col.id}
            className="w-80 flex-shrink-0 bg-gray-100 p-4 rounded-xl"
          >
            <h2 className="mb-4 text-lg font-bold text-gray-700">
              {col.title}
            </h2>
            <div>
              {tasks
                ?.filter((task) => task.status === col.id)
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              {tasks?.filter((task) => task.status === col.id).length === 0 && (
                <p className="py-4 text-sm text-center text-gray-400">
                  No tasks
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <CreateTaskForm onSuccess={() => setShowModal(false)} />
      </Modal>
    </div>
  );
};
