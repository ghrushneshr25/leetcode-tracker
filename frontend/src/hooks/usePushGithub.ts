import { useMutation } from "@tanstack/react-query";

import {
  pushSolutionToGithub,
  type PushGithubRequest,
} from "../api/github";

export function usePushGithub(questionId: number) {
  return useMutation({
    mutationFn: (request: PushGithubRequest) =>
      pushSolutionToGithub(questionId, request),
  });
}