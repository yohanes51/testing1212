import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MapPin, LogOut, User, LayoutDashboard, Car } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <MapPin className="h-6 w-6 text-primary" />
          <span>TravelKu</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Halo, {user.nama}
              </span>
              {user.role === "admin" && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin"><LayoutDashboard className="h-4 w-4 mr-1" />Admin</Link>
                </Button>
              )}
              {user.role === "driver" && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/driver"><Car className="h-4 w-4 mr-1" />Tugas Saya</Link>
                </Button>
              )}
              {user.role === "user" && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/booking"><User className="h-4 w-4 mr-1" />Booking Saya</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-1" />Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
