import { useForm } from "react-hook-form";
import {
  useCreateTaskMutation,
  type CreateTaskDto,
} from "../../entities/task/api";
import { Button, Input } from "../../shared/ui";

type CreateTaskFormProps = {
  onSuccess: () => void;
};

export const CreateTaskForm = ({ onSuccess }: CreateTaskFormProps) => {
  const {
    handleSubmit,
    formState: { isValid, errors },
    reset,
    register,
    setError,
  } = useForm<CreateTaskDto>();

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const createNewTask = async (data: CreateTaskDto) => {
    try {
      await createTask(data).unwrap();
      reset();
      onSuccess();
    } catch (error: any) {
      setError("root", {
        message: "Failed to create the task. Please try again later.",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(createNewTask)}
        className="flex flex-col gap-2 mb-6 bg-white p-4 rounded-lg shadow"
      >
        <h2 className="text-xl font-bold mb-2 text-center">Create a task</h2>
        <Input
          label="Task name"
          placeholder="What need to do"
          error={errors.title?.message}
          {...register("title", { required: "Enter the title of the task" })}
        />
        <Input
          label="Task description"
          placeholder="Details"
          {...register("description")}
        />
        <Button type="submit" isLoading={isLoading} disabled={!isValid}>
          Create
        </Button>
      </form>
    </>
  );
};
