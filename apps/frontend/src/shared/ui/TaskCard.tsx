import type { TaskType } from "../../entities/task";

export const TaskCard = ({ task }: { task: TaskType }) => (
  <div className="p-4 mb-3 bg-white rounded-lg shadow border border-gray-200">
    <h3 className="font-bold text-gray-800">{task.title}</h3>
    {task.description && (
      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
    )}
  </div>
);
