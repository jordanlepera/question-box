"use client";
import Link from "next/link";
import { CircleUser } from "lucide-react";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";

type QuizLayoutProps = {
  children: React.ReactNode;
};

export const QuizLayout: React.FC<QuizLayoutProps> = (props) => {
  const router = useRouter();
  const userLoggedIn = useUserStore((state) => state.loggedInUser);

  function logOut() {
    useUserStore.getState().signout();
    router.push("/");
  }

  return (
    <div className="flex flex-col w-full">
      <div className="border-b flex items-center justify-start p-4">
        <div className="flex flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-semibold">Question Box</span>
          </Link>
        </div>
        <div className="flex gap-4">
          {userLoggedIn && userLoggedIn.role === "admin" && (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button size="sm" variant="outline">
                  Dashboard
                </Button>
              </Link>
            </div>
          )}
          {userLoggedIn && (
            <div className="flex items-center space-x-4">
              <CircleUser className="h-5 w-5  mr-2" />
              {userLoggedIn.email}
            </div>
          )}
          {userLoggedIn && (
            <div className="flex items-center space-x-4">
              <Button size="sm" onClick={() => logOut()}>
                Sign out
              </Button>
            </div>
          )}
        </div>
      </div>
      {props.children}
    </div>
  );
};
