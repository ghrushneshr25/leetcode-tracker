import { useQuery } from "@tanstack/react-query";
import { getQuestionNotes } from "../api/questionNotes";

export function useQuestionNotes(id: number) {
  return useQuery({
    queryKey: ["question-notes", id],
    queryFn: () => getQuestionNotes(id),
    enabled: !!id,
  });
}