import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export interface GithubSolution {
  name: string;
  code: string;
}

export interface GithubSolutionsResponse {
  solutions: Record<string, GithubSolution[]>;
}

export function useGithubSolutions(questionId: number) {
  return useQuery({
    queryKey: ["github-solutions", questionId],
    queryFn: async () => {
      const { data } = await api.get<GithubSolutionsResponse>(
        `/questions/${questionId}/github`
      );

      return data;
    },
  });
}