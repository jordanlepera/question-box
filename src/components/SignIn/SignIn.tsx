"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/lib/store";
import React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

export const SignIn: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const { toast } = useToast();
  const users = useUserStore((state) => state.users);
  const signInStore = useUserStore((state) => state.signin);

  function updateEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function updatePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function signIn() {
    if (email === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide an email address to sign in.",
      });
      return;
    }

    if (password === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a password to sign in.",
      });
      return;
    }

    // check email validation with zod
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(email);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a valid email address.",
      });
      return;
    }

    const user = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not found.",
      });
      return;
    }

    signInStore(email, password);

    router.push("/quiz");
  }

  return (
    <div className="w-full h-full lg:grid lg:min-h-[600px] xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-balance text-muted-foreground p-4">
              Enter your account information below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => updateEmail(e)}
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => updatePassword(e)}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" onClick={() => signIn()}>
              Sign In
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
