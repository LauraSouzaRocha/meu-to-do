import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Label } from "../components/ui/label";

import { toast } from "../hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CheckSquare } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Invalid credentials");
      toast({ title: "Success", description: "Logged in successfully" });
      navigate("/home");
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      toast({
        title: "Error",
        description: err?.message || JSON.stringify(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100 p-4">
      <Card className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* ----- Branding ----- */}
        <CardHeader className="flex flex-col items-center space-y-2 py-6">
          <CheckSquare className="h-12 w```tsx
          <CheckSquare className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#1e3a8a] to-[#7c3aed] bg-clip-text text-transparent">
            Meu To Do
          </h1>
          <p className="text-sm text-gray-500">
            Organize suas tarefas de forma simples
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-white font-semibold rounded-md py-2 transition-colors"
              disabled={loading}
            >
              {loading ? "Logging in…" : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pt-4">
          <a
            href="/register"
            className="text-sm text-primary hover:underline"
          >
            Não tem conta? Cadastre‑se
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}