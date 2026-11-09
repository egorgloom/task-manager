import { useForm } from "react-hook-form";
import { Button, Input } from "../../shared/ui";
import { api } from "../../shared/api/api";
import { useAppDispatch } from "../../app/hooks";
import { setCredentials } from "../../entities/auth";
import { useNavigate } from "react-router-dom";

type LoginFormDataType = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm<LoginFormDataType>({
    mode: "onChange",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmitLoginForm = async (data: LoginFormDataType) => {
    try {
      const response = await api.post("/auth/login", data);
      dispatch(
        setCredentials({
          token: response.data.access_token,
          user: response.data.user,
        }),
      );
      navigate("/board");
    } catch (error: any) {
      setError("root", {
        message:
          error.response?.data?.message ||
          "Access denied. Incorrect login or password",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmitLoginForm)}
        className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md"
      >
        <h2 className="mb-6 font-bold text-2xl text-gray-300 text-center">
          Login form
        </h2>
        {errors.root && (
          <p className="mb-4 text-sm text-red-600 text-center">
            {errors.root.message}
          </p>
        )}
        <Input
          label="Email"
          type="email"
          placeholder="test@mail.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Некорректный email" },
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
          })}
        />
        <Button type="submit" isLoading={isSubmitting} disabled={!isValid}>
          Sign In
        </Button>
      </form>
    </>
  );
};
