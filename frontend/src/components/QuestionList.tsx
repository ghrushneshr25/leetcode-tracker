import type { Question } from "../types/question";

import QuestionCard from "./QuestionCard";

interface Props {
  questions: Question[];
}

export default function QuestionList({
  questions,
}: Props) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
        />
      ))}
    </div>
  );
}