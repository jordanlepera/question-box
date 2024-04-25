"use client";
import { useQuizStore, useUserStore } from "@/lib/store";
import { Quiz } from "@/mock/data";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";

const QuizList: React.FC = () => {
  const selectedQuizId = useQuizStore((state) => state.selectedQuiz);
  const quizesStore = useQuizStore((state) => state.quizes);
  const addQuizStore = useQuizStore((state) => state.addQuiz);
  const editQuizStore = useQuizStore((state) => state.editQuiz);
  const deleteQuizStore = useQuizStore((state) => state.deleteQuiz);
  const userLoggedIn = useUserStore((state) => state.loggedInUser);
  const { toast } = useToast();

  const [quizesEdit, setQuizesEdit] = React.useState<Quiz[]>(
    quizesStore.slice(),
  );
  const [newQuiz, setNewQuiz] = React.useState<Quiz>({
    id: quizesStore.length,
    title: "",
    questions: [],
    userId: userLoggedIn ? userLoggedIn.id : 0,
    answers: [],
  });

  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  function addQuizEditTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuizCopy = newQuiz;
    newQuizCopy.title = e.target.value;
    setNewQuiz(newQuizCopy);
  }

  function addQuizEditQuestion(
    e: React.ChangeEvent<HTMLTextAreaElement>,
    questionId: number,
  ) {
    const newQuizCopy = newQuiz;
    newQuizCopy.questions[questionId].text = e.target.value;
    setNewQuiz(newQuizCopy);
  }

  function addQuestionToQuiz(quizId: number) {
    const quiz = quizesEdit.find((q) => q.id === quizId);
    if (quiz) {
      quiz.questions.push({
        id: quiz.questions.length === 0 ? 0 : quiz.questions.length + 1,
        text: "",
      });
      setQuizesEdit(quizesEdit.map((q) => (q.id === quiz.id ? quiz : q)));
    }
  }

  function deleteQuestionFromEditQuiz(quizId: number, questionId: number) {
    const quiz = quizesEdit.find((q) => q.id === quizId);
    if (quiz) {
      const updatedQuizQuestions = quiz.questions.filter(
        (q) => q.id !== questionId,
      );
      quiz.questions = updatedQuizQuestions;
      setQuizesEdit(quizesEdit.map((q) => (q.id === quiz.id ? quiz : q)));
    }
  }

  function addQuestionToNewQuiz() {
    // Create a deep copy of newQuiz
    const quizToAddQuestion = JSON.parse(JSON.stringify(newQuiz));

    // Determine the ID for the new question
    const newQuestionId =
      quizToAddQuestion.questions.length === 0
        ? 0
        : quizToAddQuestion.questions.length;

    // Add the new question to the copied quiz
    quizToAddQuestion.questions.push({ id: newQuestionId, text: "" });

    // Update the state with the modified quiz
    setNewQuiz(quizToAddQuestion);
  }

  function deleteQuestionFromNewQuiz(questionId: number) {
    const newQuizCopy = newQuiz;
    const updatedQuizQuestions = newQuizCopy.questions.filter(
      (q) => q.id !== questionId,
    );
    setNewQuiz({ ...newQuiz, questions: updatedQuizQuestions });
  }

  function editQuizChangeTitle(
    e: React.ChangeEvent<HTMLInputElement>,
    quizId: number,
  ) {
    const quiz = quizesEdit.find((q) => q.id === quizId);
    if (quiz) {
      quiz.title = e.target.value;
      setQuizesEdit(quizesEdit.map((q) => (q.id === quiz.id ? quiz : q)));
    }
  }

  function editQuizChangeQuestion(
    e: React.ChangeEvent<HTMLTextAreaElement>,
    quizId: number,
    questionId: number,
  ) {
    const quiz = quizesEdit.find((q) => q.id === quizId);
    if (quiz) {
      quiz.questions[questionId].text = e.target.value;
      setQuizesEdit(quizesEdit.map((q) => (q.id === quiz.id ? quiz : q)));
    }
  }

  function editQuiz(quizId: number) {
    const quiz = quizesEdit.find((q) => q.id === quizId);
    if (quiz) {
      //check and remove empty questions in store and in state
      quiz.questions = quiz.questions.filter((q) => q.text !== "");

      if (quiz.title === "") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Quiz title cannot be empty",
        });
        return;
      }

      if (quiz.questions.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Quiz must have at least one question",
        });
        return;
      }

      if (quiz.questions.some((q) => q.text === "")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Questions cannot be empty",
        });
        return;
      }
      // save the edited quiz
      editQuizStore(quiz);
      setQuizesEdit(quizesEdit.map((q) => (q.id === quiz.id ? quiz : q)));
    }
  }

  function changeSelectedQuiz(quizId: number) {
    useQuizStore.getState().setSelectedQuiz(quizId);
  }

  function addQuiz() {
    const newQuizToAdd: Quiz = {
      id:
        quizesStore.reduce((max, quiz) => (quiz.id > max ? quiz.id : max), 0) +
        1,
      userId: userLoggedIn ? userLoggedIn.id : 0,
      title: newQuiz.title,
      questions: newQuiz.questions,
      answers: [],
    };

    if (newQuizToAdd.title === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Quiz title cannot be empty",
      });
      return;
    }

    if (newQuizToAdd.questions.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Quiz must have at least one question",
      });
      return;
    }

    if (newQuizToAdd.questions.some((q) => q.text === "")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Questions cannot be empty",
      });
      return;
    }

    // set the new quiz to selected quiz if it's the first quiz to be added
    if (quizesStore.length === 0) {
      useQuizStore.getState().setSelectedQuiz(newQuizToAdd.id);
    }
    const newAllQuizes = [...quizesStore];
    newAllQuizes.push(newQuizToAdd);
    setQuizesEdit(newAllQuizes);
    addQuizStore(newQuizToAdd);
    setOpenAddDialog(false);
  }

  function deleteQuiz(quizId: number) {
    if (selectedQuizId === quizId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You cannot delete the selected quiz",
      });
      return;
    }
    deleteQuizStore(quizId);
    const newAllQuizes = quizesEdit.filter((q) => q.id !== quizId);
    setQuizesEdit(newAllQuizes);
  }

  function DisplayAddButton() {
    const currentQuizToAdd: Quiz = JSON.parse(JSON.stringify(newQuiz));
    if (
      currentQuizToAdd.title !== "" &&
      currentQuizToAdd.questions.length > 0 &&
      currentQuizToAdd.questions.some((q) => q.text === "") === false
    ) {
      return (
        <DialogClose asChild>
          <Button type="submit" onClick={() => addQuiz()}>
            Add
          </Button>
        </DialogClose>
      );
    } else {
      return (
        <Button type="submit" onClick={() => addQuiz()}>
          Add
        </Button>
      );
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Quiz list</h1>
        <Dialog
          open={openAddDialog}
          onOpenChange={(state) => {
            if (state === true) {
              setNewQuiz({
                id: quizesStore.length,
                title: "",
                questions: [],
                userId: userLoggedIn ? userLoggedIn.id : 0,
                answers: [],
              });
            } else {
              setNewQuiz({
                id: quizesStore.length,
                title: "",
                questions: [],
                userId: userLoggedIn ? userLoggedIn.id : 0,
                answers: [],
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="ml-auto" onClick={() => setOpenAddDialog(true)}>
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[460px]"
            hideCloseButton
            onInteractOutside={() => setOpenAddDialog(false)}
            onEscapeKeyDown={() => setOpenAddDialog(false)}
          >
            <DialogHeader>
              <DialogTitle>Add Quiz</DialogTitle>
              <DialogDescription>
                Enter a title and add questions to your quiz here. Click add
                when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-4 pb-4">
                <Label className="text-right">Title</Label>
                <Input
                  id="title"
                  defaultValue={newQuiz.title}
                  onChange={(e) => addQuizEditTitle(e)}
                />
              </div>
              {newQuiz.questions.map((q, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <Label className="text-right">Question {i + 1}</Label>
                  <div className="flex items-center gap-2 w-full">
                    <Textarea
                      id="question"
                      defaultValue={q.text}
                      onChange={(e) => addQuizEditQuestion(e, i)}
                    />
                    <Button
                      variant="destructive"
                      onClick={() => deleteQuestionFromNewQuiz(q.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" onClick={() => addQuestionToNewQuiz()}>
              Add question
            </Button>
            <DialogFooter>
              <DisplayAddButton />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {quizesStore.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No quizes found
            </h3>
            <p className="text-sm text-muted-foreground">
              You can create a new quiz by clicking the button below.
            </p>
            <Dialog
              open={openAddDialog}
              onOpenChange={(state) => {
                if (state === true) {
                  setNewQuiz({
                    id: quizesStore.length,
                    title: "",
                    questions: [],
                    userId: userLoggedIn ? userLoggedIn.id : 0,
                    answers: [],
                  });
                } else {
                  setNewQuiz({
                    id: quizesStore.length,
                    title: "",
                    questions: [],
                    userId: userLoggedIn ? userLoggedIn.id : 0,
                    answers: [],
                  });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="ml-auto"
                  onClick={() => setOpenAddDialog(true)}
                >
                  Add Quiz
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[460px]"
                hideCloseButton
                onInteractOutside={() => setOpenAddDialog(false)}
                onEscapeKeyDown={() => setOpenAddDialog(false)}
              >
                <DialogHeader>
                  <DialogTitle>Add Quiz</DialogTitle>
                  <DialogDescription>
                    Enter a title and add questions to your quiz here. Click add
                    when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex items-center gap-4 pb-4">
                    <Label className="text-right">Title</Label>
                    <Input
                      id="title"
                      defaultValue={newQuiz.title}
                      onChange={(e) => addQuizEditTitle(e)}
                    />
                  </div>
                  {newQuiz.questions.map((q, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-4 w-full"
                    >
                      <Label className="text-right">Question {i + 1}</Label>
                      <div className="flex items-center gap-2 w-full">
                        <Textarea
                          id="question"
                          defaultValue={q.text}
                          onChange={(e) => addQuizEditQuestion(e, i)}
                        />
                        <Button
                          variant="destructive"
                          onClick={() => deleteQuestionFromNewQuiz(q.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={() => addQuestionToNewQuiz()}>
                  Add question
                </Button>
                <DialogFooter>
                  <DisplayAddButton />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-start justify-start gap-4 rounded-lg border border-dashed shadow-sm p-8 w-full">
          {quizesStore.map((quiz, quizId) => (
            <Card key={quizId} className="w-full sm:w-[350px] h-fit">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <div>{quiz.title}</div>
                    <Button
                      variant="outline"
                      onClick={() => changeSelectedQuiz(quiz.id)}
                    >
                      <Star
                        fill={`${selectedQuizId === quiz.id ? "#121212" : "#FFFFFF"}`}
                      />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  Number of questions:{" "}
                  {quiz.questions ? quiz.questions.length : 0}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog
                  onOpenChange={(state) => {
                    if (state === false) {
                      const currentQuiz = quizesEdit.find(
                        (q) => q.id === quiz.id,
                      );
                      if (
                        currentQuiz &&
                        currentQuiz.title !== "" &&
                        currentQuiz.questions.length > 0
                      ) {
                        editQuiz(quiz.id);
                      }
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit</Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[600px]"
                    onEscapeKeyDown={(e) =>
                      quizesEdit.find((q) => q.id === quiz.id)?.title === ""
                        ? e.preventDefault()
                        : null
                    }
                    onInteractOutside={(e) =>
                      quizesEdit.find((q) => q.id === quiz.id)?.title === ""
                        ? e.preventDefault()
                        : null
                    }
                    hideCloseButton
                  >
                    <DialogHeader>
                      <DialogTitle>Edit Quiz</DialogTitle>
                      <DialogDescription>
                        Make changes to your quiz here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center gap-4">
                        <Label className="text-right">Title</Label>
                        <Input
                          id="title"
                          value={
                            quizesEdit.find((q) => q.id === quiz.id)?.title
                          }
                          onChange={(e) => editQuizChangeTitle(e, quiz.id)}
                        />
                      </div>
                      {quiz.questions.map((q, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-4"
                        >
                          <Label htmlFor="question" className="text-right">
                            Question {i + 1}
                          </Label>
                          <div className="flex w-full items-center gap-2">
                            <Textarea
                              id="question"
                              defaultValue={q.text}
                              className="col-span-3"
                              onChange={(e) =>
                                editQuizChangeQuestion(e, quiz.id, i)
                              }
                            />
                            <Button
                              variant="destructive"
                              className="w-fit"
                              onClick={() =>
                                deleteQuestionFromEditQuiz(quiz.id, q.id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() => addQuestionToQuiz(quiz.id)}
                    >
                      Add question
                    </Button>
                    <DialogFooter>
                      {quizesEdit.find((q) => q.id === quiz.id)?.title !==
                      "" ? (
                        <DialogClose asChild>
                          <Button
                            type="submit"
                            onClick={() => editQuiz(quiz.id)}
                          >
                            Save changes
                          </Button>
                        </DialogClose>
                      ) : (
                        <Button type="submit" onClick={() => editQuiz(quiz.id)}>
                          Save changes
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => deleteQuiz(quiz.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default QuizList;
