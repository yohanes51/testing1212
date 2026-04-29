import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Login berhasil!");
      navigate("/");
    } else {
      toast.error("Email atau password salah");
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Masuk ke akun TravelKu kamu</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" required /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Akun demo:</p>
              <p>Admin: admin@travel.com / password</p>
              <p>User: user@travel.com / password</p>
              <p>Driver: driver@travel.com / password</p>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button className="w-full" type="submit">Login</Button>
            <p className="text-sm text-muted-foreground">Belum punya akun? <Link to="/register" className="text-primary underline">Register</Link></p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
