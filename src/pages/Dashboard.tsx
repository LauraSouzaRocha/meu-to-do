import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import supabase from "../lib/supabase";
import { toast } from "../hooks/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUserEmail(data.session?.user?.email ?? "");
    };
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUserEmail(session?.user?.email ?? "");
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Você saiu da conta.",
    });
    navigate("/login");
  };

  if (!session) {
    // optional loading state
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl rounded-xl shadow-lg border bg-white">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CardTitle className="text-2xl">Bem‑vindo{userEmail ? `, ${userEmail}` : ""}!</CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Você está autenticado. Esta é a área privada do aplicativo.
          </p>
          {session?.access_token && (
            <p className="mt-4 text-sm text-muted-foreground">
              Token (primeiros 20 caracteres):{" "}
              <span className="font-mono">{session.access_token.slice(0, 20)}...</span>
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}