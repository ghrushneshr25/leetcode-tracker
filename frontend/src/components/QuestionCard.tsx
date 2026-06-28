import type { Question } from "../types/question";
import { useUpdateQuestion } from "../hooks/useUpdateQuestion";

import {
  ArrowRightToLine,
  Check,
  LoaderCircle,
  RotateCcw,
  X,
} from "lucide-react";

interface Props {
  question: Question;
}

export default function QuestionCard({ question }: Props) {
  const mutation = useUpdateQuestion();

  const toggleCompleted = () => {
    mutation.mutate({
      id: question.id,
      completed: !question.completed,
    });
  };

  const toggleReattempt = () => {
  mutation.mutate({
  id: question.id,
  completed: true,
});

mutation.mutate({
  id: question.id,
  needsReattempt: true,
});

mutation.mutate({
  id: question.id,
  completed: true,
  needsReattempt: true,
});
  };

  const difficultyClasses = {
    EASY: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HARD: "bg-red-100 text-red-700",
  };

  const completedAt = question.completedAt
    ? new Date(question.completedAt).toLocaleString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg ${
        question.completed
          ? "border-l-4 border-l-green-500"
          : ""
      } ${
        question.needsReattempt
          ? "border-r-4 border-r-orange-500"
          : ""
      }`}
    >
      <div className="flex gap-8">
        {/* Left */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">
              {question.questionFrontendId}. {question.title}
            </h2>

            {question.needsReattempt && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                Needs Reattempt
              </span>
            )}
          </div>

          <p className="mt-3 max-w-4xl text-lg leading-8 text-gray-600 line-clamp-3">
            {question.description}
          </p>

          <div className="mt-5">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                difficultyClasses[question.difficulty]
              }`}
            >
              {question.difficulty}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {question.topicTags.map((tag) => (
              <span
                key={tag.slug}
                className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex w-36 flex-col items-center border-l pl-6">
          <button
            onClick={() =>
              window.open(
                `https://leetcode.com/problems/${question.titleSlug}`,
                "_blank"
              )
            }
            className="rounded-2xl border border-blue-500 p-4 text-blue-600 transition hover:bg-blue-50"
            title="Open on LeetCode"
          >
            <ArrowRightToLine size={28} />
          </button>

          <button
            disabled={mutation.isPending}
            onClick={toggleCompleted}
            className={`mt-4 rounded-2xl border p-4 transition ${
              question.completed
                ? "border-red-500 text-red-500 hover:bg-red-50"
                : "border-green-500 text-green-500 hover:bg-green-50"
            }`}
            title={
              question.completed
                ? "Mark Incomplete"
                : "Mark Complete"
            }
          >
            {mutation.isPending ? (
              <LoaderCircle
                size={28}
                className="animate-spin"
              />
            ) : question.completed ? (
              <X size={28} />
            ) : (
              <Check size={28} />
            )}
          </button>

          <button
            disabled={
              mutation.isPending ||
              !question.completed
            }
            onClick={toggleReattempt}
            className={`mt-4 rounded-2xl border p-4 transition ${
              !question.completed
                ? "cursor-not-allowed border-gray-200 text-gray-300"
                : question.needsReattempt
                ? "border-orange-500 bg-orange-50 text-orange-600"
                : "border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
            title={
              question.completed
                ? "Toggle Needs Reattempt"
                : "Complete the question first"
            }
          >
            <RotateCcw size={28} />
          </button>

          <div className="mt-6 w-full border-t pt-4 text-center">
            {completedAt ? (
              <p className="text-sm font-medium text-gray-500">
                {completedAt}
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-400">
                Not Solved
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}