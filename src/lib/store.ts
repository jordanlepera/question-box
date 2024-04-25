import { create } from "zustand";
import { usersData, quizData } from "@/mock/data";
import type { Quiz, User } from "@/mock/data";

export type UserStoreState = {
  users: User[];
  loggedInUser: User | null;
  signin: (email: string, password: string) => void;
  signup: (user: User) => void;
  signout: () => void;
};

export const useUserStore = create<UserStoreState>((set) => ({
  users: usersData,
  loggedInUser: null,
  signin: (email: string, password: string) =>
    set((state) => ({
      loggedInUser: state.users.find(
        (u: User) => u.email === email && u.password === password,
      ),
    })),
  signup: (user: User) => set((state) => ({ users: [...state.users, user] })),
  signout: () => set({ loggedInUser: null }),
}));

export type QuizStoreState = {
  selectedQuiz: number;
  quizes: Quiz[];
  quizResults: Quiz[];
  setSelectedQuiz: (quizId: number) => void;
  addQuiz: (quiz: Quiz) => void;
  editQuiz: (quiz: Quiz) => void;
  deleteQuiz: (quizId: number) => void;
  saveQuizResult: (result: Quiz) => void;
};

export const useQuizStore = create<QuizStoreState>((set) => ({
  selectedQuiz: 0,
  quizes: quizData,
  quizResults: [],
  setSelectedQuiz: (quizId: number) => set({ selectedQuiz: quizId }),
  addQuiz: (quiz: Quiz) =>
    set((state) => ({ quizes: [...state.quizes, quiz] })),
  editQuiz: (quiz: Quiz) =>
    set((state) => ({
      quizes: state.quizes.map((q) => (q.id === quiz.id ? quiz : q)),
    })),
  deleteQuiz: (quizId: number) =>
    set((state) => ({ quizes: state.quizes.filter((q) => q.id !== quizId) })),
  saveQuizResult: (result: Quiz) =>
    set((state) => ({ quizResults: [...state.quizResults, result] })),
}));
