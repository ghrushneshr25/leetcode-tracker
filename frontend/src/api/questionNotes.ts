import api from "./api.ts";

import type {
  QuestionNotes,
  UpdateQuestionNotesRequest,
} from "../types/questionNotes";

export async function getQuestionNotes(
  id: number,
): Promise<QuestionNotes> {
  const response = await api.get<QuestionNotes>(
    `/api/questions/${id}/notes`,
  );

  return response.data;
}

export async function updateQuestionNotes(
  id: number,
  request: UpdateQuestionNotesRequest,
) {
  return api.patch(
    `/api/questions/${id}/notes`,
    request,
  );
}