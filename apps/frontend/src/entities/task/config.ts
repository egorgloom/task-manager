import type { TaskType } from "./api";

export const TASK_COLUMNS: { id: TaskType["status"]; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];
