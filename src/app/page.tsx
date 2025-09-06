"use client";
// app/login/page.tsx
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LogIn } from "@/types/pos";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner"
import { useAuthStore } from "@/lib/authStore";
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, fetchUser } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    fetchUser().then(() => {
      if (!useAuthStore.getState().user) {
        router.push('/');
      }
      router.push('/sales/tables');
    });
  }, [])
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      fetchUser().then(() => {
        if (!useAuthStore.getState().user) {
          router.push('/');
        }
        router.push('/sales/tables');
      });

    } catch (error) {
      // Error is handled by useAuthStore
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">

      <Card className="w-full max-w-md p-6">
        <div className="mx-auto">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={40}
            priority
            className="mx-auto"
          />
          <h1 className="text-2xl text-center font-bold mb-6 ">Login</h1>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            placeholder="Username"
            className="my-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            className="my-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">
            {" "}
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
