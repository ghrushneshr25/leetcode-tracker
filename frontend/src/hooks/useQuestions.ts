import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "../api/questions";
import type { Question } from "../types/question";

export function useQuestions() {
  return useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });
}