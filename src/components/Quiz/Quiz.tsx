"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Quiz } from "@/mock/data";
import { quizData } from "@/mock/data";
import React from "react";
import { useUserStore, useQuizStore } from "@/lib/store";
import { QuizLayout } from "@/components/Quiz/QuizLayout";

export function Quiz() {
  const userLoggedIn = useUserStore((state) => state.loggedInUser);
  const selectedQuizId = useQuizStore((state) => state.selectedQuiz);
  const allQuizes: Quiz[] = useQuizStore((state) => state.quizes);
  const selectedQuiz: Quiz =
    allQuizes.find((q) => q.id === selectedQuizId) ?? quizData[0];
  const [quiz, setQuiz] = React.useState<Quiz>({
    ...selectedQuiz,
    userId: userLoggedIn ? userLoggedIn.id : 0,
  });
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [review, setReview] = React.useState(false);
  const { toast } = useToast();

  const saveQuizResultStore = useQuizStore((state) => state.saveQuizResult);

  React.useEffect(() => {
    // update the quiz state when the selected quiz changes
    setQuiz({ ...selectedQuiz, userId: userLoggedIn ? userLoggedIn.id : 0 });
    setCurrentQuestion(0);
    setAnswer("");
    setReview(false);
  }, [selectedQuiz, selectedQuizId, userLoggedIn]);

  function updateAnswer(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setAnswer(event.target.value);
  }

  function saveAnswer() {
    if (!quiz.answers) {
      quiz.answers = [];
    }
    quiz.answers[currentQuestion] = {
      questionId: currentQuestion,
      answer: answer,
    };
    setQuiz(quiz);
  }

  function goToReview() {
    saveAnswer();
    // check if all questions have been answered
    const unanswered = quiz.answers?.filter((a) => a.answer === "");
    if (unanswered && unanswered.length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please answer all questions before reviewing the quiz.",
      });
      return;
    }
    saveAnswer();
    setReview(true);
  }

  function goToPreviousQuestion() {
    saveAnswer();
    // load the previous answer
    const prevAnswer = quiz.answers?.find(
      (a) => a.questionId === currentQuestion - 1 ?? "",
    );
    if (prevAnswer === undefined) {
      setAnswer("");
    } else {
      setAnswer(prevAnswer.answer);
    }
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You are at the first question.",
      });
    }
  }

  function goToNextQuestion() {
    if (answer === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Please provide an answer before moving to the next question.",
      });
      return;
    }
    saveAnswer();
    // load the next answer if it exists
    const nextAnswer = quiz.answers?.find(
      (a) => a.questionId === currentQuestion + 1 ?? "",
    );
    if (nextAnswer === undefined || nextAnswer.answer === "") {
      setAnswer("");
    } else {
      setAnswer(nextAnswer.answer);
    }
    setCurrentQuestion(currentQuestion + 1);
    if (currentQuestion === quiz.questions.length) {
      toast({
        title: "Quiz completed",
        description: "You have successfully completed the quiz.",
      });
    }
  }

  function submit() {
    // save quiz result
    saveQuizResultStore(quiz);
    toast({
      title: "Quiz submitted",
      description:
        "You have successfully submitted the quiz. Thank you for your participation !",
    });
    setReview(false);
    setCurrentQuestion(0);
    setAnswer("");
    setQuiz({
      ...selectedQuiz,
      answers: [],
      userId: userLoggedIn ? userLoggedIn.id : 0,
    });
  }

  function Review() {
    return (
      <div className="flex-1 grid items-center justify-center p-4 mt-12">
        <div className="space-y-4 w-full max-w-3xl">
          <h1 className="text-3xl font-bold py-4">Quiz Review</h1>
          <div className="space-y-2 flex flex-col">
            {quiz.questions.map((q, i) => (
              <div key={i} className="flex flex-col">
                <h1 className="text-xl font-bold">{q.text}</h1>
                <p>{quiz.answers?.find((a) => a.questionId === i)?.answer}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-between pt-8">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setReview(false)}
            >
              Back to quiz
            </Button>
            <Button
              size="sm"
              onClick={() => submit()}
              className="bg-green-700 hover:bg-green-600"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QuizLayout>
      {userLoggedIn && selectedQuiz ? (
        review ? (
          <Review />
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 mt-12">
            <div className="w-full max-w-3xl">
              <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold py-10">{quiz.title}</h1>
                <h1 className="text-xl font-bold py-10">
                  {quiz.questions[currentQuestion].text}
                </h1>
                <Textarea
                  placeholder="Type your answer here."
                  onChange={(e) => updateAnswer(e)}
                  value={answer}
                  className="m-8"
                />
                <div className="flex w-full justify-between">
                  {currentQuestion > 0 && (
                    <Button size="sm" onClick={() => goToPreviousQuestion()}>
                      Previous question
                    </Button>
                  )}
                  {currentQuestion < quiz.questions.length - 1 && (
                    <Button size="sm" onClick={() => goToNextQuestion()}>
                      Next question
                    </Button>
                  )}
                  {currentQuestion === quiz.questions.length - 1 && (
                    <Button
                      size="sm"
                      className="bg-green-700 hover:bg-green-600"
                      onClick={() => goToReview()}
                    >
                      Review Quiz
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      ) : selectedQuiz ? (
        <div className="flex-1 grid items-center justify-center p-4 mt-12">
          <div className="space-y-4 w-full max-w-3xl">
            <h1 className="text-3xl font-bold py-4">
              You are not authorized to access the quiz
            </h1>
            <Link href="/">
              <Button size="sm">Back to home</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid items-center justify-center p-4 mt-12">
          <div className="space-y-4 w-full max-w-3xl flex flex-col items-center">
            <h1 className="text-3xl font-bold py-4">No quiz available</h1>
          </div>
        </div>
      )}
    </QuizLayout>
  );
}
