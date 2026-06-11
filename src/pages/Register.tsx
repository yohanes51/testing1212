import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Register = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(nama, email, password)) {
      toast.success("Registrasi berhasil!");
      navigate("/");
    } else {
      toast.error("Email sudah terdaftar");
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Buat akun TravelKu baru</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div><Label>Nama</Label><Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama lengkap" required /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" required /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} /></div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button className="w-full" type="submit">Register</Button>
            <p className="text-sm text-muted-foreground">Sudah punya akun? <Link to="/login" className="text-primary underline">Login</Link></p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
