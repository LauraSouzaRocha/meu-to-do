import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function Dashboard() {
  const token = localStorage.getItem("auth_token");
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You are logged in. Token: {token?.slice(0, 20)}...</p>
        </CardContent>
      </Card>
    </div>
  );
}
