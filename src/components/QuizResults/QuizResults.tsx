"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useQuizStore, useUserStore } from "@/lib/store";

const QuizList: React.FC = () => {
  const quizesResultsStore = useQuizStore((state) => state.quizResults);
  const usersStore = useUserStore((state) => state.users);

  function getUser(userId: number) {
    return usersStore.find((user) => user.id === userId);
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Quiz results</h1>
      </div>
      {quizesResultsStore.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No quizes results found
            </h3>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 rounded-lg border border-dashed shadow-sm p-8">
          {quizesResultsStore.map((result, resultId) => (
            <Card key={resultId} className="w-[350px] h-fit">
              <CardHeader>
                <CardTitle>{result.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  user: {getUser(result.userId!)?.email ?? "Unknown"}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader>
                      <DialogTitle>Results</DialogTitle>
                      <DialogDescription>
                        Results for quiz &apos;{result.title}&apos;
                        <br />
                        Answered by{" "}
                        {getUser(result.userId!)?.email ?? "Unknown"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 grid items-center justify-start p-4">
                      <div className="space-y-2 flex flex-col">
                        {result.questions.map((q, i) => (
                          <div key={i} className="flex flex-col">
                            <h1 className="text-xl font-bold">{q.text}</h1>
                            <p>
                              {
                                result.answers?.find((a) => a.questionId === i)
                                  ?.answer
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default QuizList;
