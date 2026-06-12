import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/todo/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success("Logged in");
      navigate("/dashboard");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Email</label>
          <input {...register("email")} className="w-full border rounded p-2" />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border rounded p-2"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-indigo-600 text-white rounded"
        >
          {isSubmitting ? "Logging…" : "Login"}
        </button>
      </form>
      <p className="mt-4">
        No account? <Link to="/register" className="text-indigo-600">Register</Link>
      </p>
    </div>
  );
}
