import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateQuestionNotes } from "../api/questionNotes";
import type { UpdateQuestionNotesRequest } from "../types/questionNotes";

export function useUpdateQuestionNotes(questionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateQuestionNotesRequest) =>
      updateQuestionNotes(questionId, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["question-notes", questionId],
      });
    },
  });
}