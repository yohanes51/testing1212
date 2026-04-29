import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: number;
  nama: string;
  email: string;
  role: "user" | "admin" | "driver";
}

interface AuthContextType {
  user: User | null;
  users: { id: number; nama: string; email: string; role: "user" | "admin" | "driver" }[];
  login: (email: string, password: string) => boolean;
  register: (nama: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const initialUsers = [
  { id: 1, nama: "Admin", email: "admin@travel.com", password: "password", role: "admin" as const },
  { id: 2, nama: "User Demo", email: "user@travel.com", password: "password", role: "user" as const },
  { id: 3, nama: "Pak Budi", email: "budi@travel.com", password: "password", role: "driver" as const },
  { id: 4, nama: "Pak Joko", email: "joko@travel.com", password: "password", role: "driver" as const },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser({ id: found.id, nama: found.nama, email: found.email, role: found.role });
      return true;
    }
    return false;
  };

  const register = (nama: string, email: string, password: string) => {
    if (users.find((u) => u.email === email)) return false;
    const newUser = { id: users.length + 1, nama, email, password, role: "user" as const };
    setUsers([...users, newUser]);
    setUser({ id: newUser.id, nama: newUser.nama, email: newUser.email, role: newUser.role });
    return true;
  };

  const logout = () => setUser(null);

  const publicUsers = users.map(({ password, ...u }) => u);

  return (
    <AuthContext.Provider value={{ user, users: publicUsers, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
