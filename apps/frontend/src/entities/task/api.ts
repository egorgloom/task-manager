import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskType = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskDto = {
  title: string;
  description?: string;
};

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<TaskType[], void>({
      query: () => "/tasks",
      providesTags: ["Task"],
    }),
    createTask: builder.mutation<TaskType, CreateTaskDto>({
      query: (newTask) => ({
        url: "/tasks",
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const { useGetTasksQuery, useCreateTaskMutation } = tasksApi;
