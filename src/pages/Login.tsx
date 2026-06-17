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

      if (!data.user) {
        throw new Error("Credenciais inválidas");
      }

      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso",
      });

      navigate("/home");
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err?.message || "Falha ao fazer login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-3 pt-8">
          <CheckSquare className="h-12 w-12 text-[#7c3aed]" />

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#1e3a8a] to-[#7c3aed] bg-clip-text text-transparent">
            Meu To Do
          </h1>

          <p className="text-sm text-muted-foreground">
            Organize suas tarefas de forma simples
          </p>

          <div className="pt-2 text-center">
            <h2 className="text-xl font-semibold text-slate-800">
              Entrar
            </h2>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/register"
            className="text-sm text-[#1e3a8a] hover:underline"
          >
            Não possui uma conta? Cadastre-se
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

