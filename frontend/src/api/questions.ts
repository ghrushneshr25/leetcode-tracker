import axios from "axios";
import type { Question } from "../types/question";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});



export async function getQuestions(): Promise<Question[]> {
  const response = await api.get<Question[]>("/api/questions");
  return response.data;
}


export type UpdateQuestionRequest = {
  id: number;
  completed?: boolean;
  completedAt?: string;
  needsReattempt?: boolean;
};

export function updateQuestion({
  id,
  ...payload
}: UpdateQuestionRequest) {
  return api.patch(`/api/questions/${id}`, payload);
}