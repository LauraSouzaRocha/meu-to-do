import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { toast } from "../hooks/use-toast";
import supabase from "../lib/supabase";
import { Separator } from "../components/ui/separator";
import { Google, Github } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Logged in",
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider: string) => {
    toast({
      title: "Info",
      description: "Integração disponível em versões futuras.",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md rounded-xl shadow-lg border bg-white">
        <CardHeader className="flex flex-col items-center space-y-4">
          {/* Supabase logo */}
          <img
            src="https://supabase.com/img/supabase-logo.png"
            alt="Supabase"
            className="h-12 w-auto"
          />
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Autenticação via Supabase Auth
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Entrar"}
            </Button>

            {/* Separator with text */}
            <div className="flex items-center my-4">
              <Separator />
              <span className="px-2 text-sm text-muted-foreground">
                Ou continue com
              </span>
              <Separator />
            </div>

            {/* Social buttons */}
            <div className="flex flex-col space-y-3">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center space-x-2"
                onClick={() => handleSocial("google")}
              >
                <Google className="h-4 w-4" />
                <span>Continuar com Google</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center space-x-2"
                onClick={() => handleSocial("github")}
              >
                <Github className="h-4 w-4" />
                <span>Continuar com GitHub</span>
              </Button>
</Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <a
              href="/register"
              className="text-sm text-primary hover:underline"
            >
              Não tem conta? Registre‑se
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}