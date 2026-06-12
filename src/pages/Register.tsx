import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/todo/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
      toast.success("Account created");
      navigate("/login");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Name</label>
          <input {...register("fullName")} className="w-full border rounded p-2" />
          {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} className="w-full border rounded p-2" />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register("password")} className="w-full border rounded p-2" />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-indigo-600 text-white rounded">
          {isSubmitting ? "Registering…" : "Register"}
        </button>
      </form>
      <p className="mt-4">
        Already have an account? <Link to="/login" className="text-indigo-600">Login</Link>
      </p>
    </div>
  );
}
