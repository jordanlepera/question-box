export type Role = "admin" | "user";

export type User = {
  id: number;
  role: Role;
  email: string;
  password: string;
};

export type Quiz = {
  id: number;
  title: string;
  userId?: number;
  questions: Question[];
  answers?: Answer[];
};

export type Question = {
  id: number;
  text: string;
};

export type Answer = {
  questionId: number;
  answer: string;
};

export let usersData: User[] = [
  {
    id: 0,
    role: "admin",
    email: "john.doe@test.com",
    password: "password",
  },
  {
    id: 1,
    role: "user",
    email: "john.doe2@test.com",
    password: "password2",
  },
];

export let quizData: Quiz[] = [
  {
    id: 0,
    title: "Company's restaurant service quality",
    userId: 0,
    questions: [
      {
        id: 0,
        text: "What do you think of the quality of the food?",
      },
      {
        id: 1,
        text: "What do you think about the choices ?",
      },
      {
        id: 2,
        text: "What do you think about the personal ?",
      },
    ],
  },
];
