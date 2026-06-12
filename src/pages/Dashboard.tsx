import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/todo/hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/login");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl rounded-xl shadow-lg border bg-white">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CardTitle className="text-2xl">Bem‑vindo, {user.email}!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Você está autenticado. Esta é a área privada do aplicativo.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleLogout} variant="destructive">Logout</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
