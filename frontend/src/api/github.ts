import api from "axios";

export interface PushGithubRequest {
  language: string;
  code: string;
  name: string;   
}

export interface PushGithubResponse {
  path: string;
  sha: string;
  url: string;
}

export async function pushSolutionToGithub(
  questionId: number,
  request: PushGithubRequest,
) {
  const response = await api.post<PushGithubResponse>(
    `/api/questions/${questionId}/github`,
    request,
  );

  return response.data;
}