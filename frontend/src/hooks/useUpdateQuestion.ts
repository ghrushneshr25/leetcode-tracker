import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateQuestion,
  type UpdateQuestionRequest,
} from "../api/questions";

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateQuestionRequest) =>
      updateQuestion(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
  });
}