// app/login/page.tsx
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">POS Login</h1>
        <form className="space-y-4">
          <Input placeholder="Username" />
          <Input type="password" placeholder="Password" />
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </Card>
    </div>
  );
}