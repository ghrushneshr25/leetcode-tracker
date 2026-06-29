import type { Question } from "../types/question";
import QuestionCard from "./QuestionCard";

interface Props {
  questions: Question[];
  onOpen: (question: Question) => void;
}

export default function QuestionList({
  questions,
  onOpen,
}: Props) {
  if (questions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center text-gray-500">
        No questions found.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          onExpand={() => onOpen(question)}
        />
      ))}
    </div>
  );
}