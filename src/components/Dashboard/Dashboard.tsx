"use client";
import Link from "next/link";
import { CircleUser, List, ListChecks, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo/Logo";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import React from "react";
import QuizList from "@/components/QuizList/QuizList";
import QuizResults from "@/components/QuizResults/QuizResults";

export function Dashboard() {
  const userLoggedIn = useUserStore((state) => state.loggedInUser);
  const router = useRouter();

  const [selectedTab, setSelectedTab] = React.useState(0);

  function logOut() {
    useUserStore.getState().signout();
    router.push("/");
  }

  function DisplayTab() {
    switch (selectedTab) {
      case 0:
        return <QuizList />;
      case 1:
        return <QuizResults />;
      default:
        return <QuizList />;
    }
  }

  if (!userLoggedIn) {
    return (
      <div className="flex-1 grid items-center justify-center p-4 mt-12">
        <div className="space-y-4 w-full max-w-3xl">
          <h1 className="text-3xl font-bold py-4">
            You are not authorized to access this page
          </h1>
          <Link href="/">
            <Button size="sm">Back to home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex items-center border-b p-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-6 w-6" />
              <span className="font-semibold">Question Box</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedTab(0)}
                className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 ${selectedTab === 0 ? "text-primary bg-muted" : "text-muted-foreground"} transition-all hover:text-primary`}
              >
                <List className="h-4 w-4" />
                Quiz list{" "}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedTab(1)}
                className={`flex items-center justify-start gap-3 rounded-lg px-3 py-2 ${selectedTab === 1 ? "text-primary bg-muted" : "text-muted-foreground"} transition-all hover:text-primary`}
              >
                <ListChecks className="h-4 w-4" />
                Quiz results
              </Button>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex items-center gap-4 border-b bg-muted/40 p-4 justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <div className="w-full flex mb-4 gap-2">
                  <Logo className="mr-2" />
                  <span className="font-semibold">Question Box</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTab(0)}
                  className={`mx-[-0.65rem] flex items-center justify-start gap-4 rounded-xl px-3 py-2 ${selectedTab === 0 ? "text-foreground bg-muted" : "text-muted-foreground"} hover:text-foreground`}
                >
                  <List className="h-5 w-5" />
                  Quiz list
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTab(1)}
                  className={`mx-[-0.65rem] flex items-center justify-start gap-4 rounded-xl px-3 py-2 ${selectedTab === 1 ? "text-foreground bg-muted" : "text-muted-foreground"} hover:text-foreground`}
                >
                  <ListChecks className="h-5 w-5" />
                  Quiz results
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 justify-end gap-4">
            <Link href="/quiz" className="flex-1">
              <Button size="sm">Back to quiz</Button>
            </Link>
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
        </header>
        <DisplayTab />
      </div>
    </div>
  );
}
