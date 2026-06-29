import type { Question } from "../types/question";
import { useUpdateQuestion } from "../hooks/useUpdateQuestion";

import {
  ArrowRightToLine,
  Check,
  LoaderCircle,
  Maximize2,
  RotateCcw,
  X,
} from "lucide-react";

interface Props {
  question: Question;
  onExpand: () => void;
}

export default function QuestionCard({
  question,
  onExpand,
}: Props) {
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
      needsReattempt: !question.needsReattempt,
    });
  };

  const difficultyClasses = {
    EASY: "border border-gray-300 bg-gray-100 text-gray-800",
    MEDIUM: "border border-gray-300 bg-gray-100 text-gray-800",
    HARD: "border border-gray-300 bg-gray-100 text-gray-800",
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
      question.completed ? "border-l-4 border-l-black-500" : ""
    } ${
      question.needsReattempt
        ? "border-r-4 border-r-black-500"
        : ""
    }`}
  >
    <div className="flex justify-between gap-8">
      {/* Left */}
      <div className="flex flex-1 flex-col">
        {/* Title */}
        <h2 className="text-2xl font-bold">
          {question.questionFrontendId}. {question.title}
        </h2>

        {/* Difficulty + Status */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                difficultyClasses[question.difficulty]
              }`}
            >
              {question.difficulty}
            </span>

            {question.needsReattempt && (
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                difficultyClasses[question.difficulty]
              }`}>
                REATTEMPT
              </span>
            )}
          </div>

        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
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

      {/* Actions */}
    <div className="w-60 shrink-0">
      <div className="rounded-xl border border-black bg-white p-3 shadow-sm">
        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Details */}
          <button
            onClick={onExpand}
            title="View Details"
            className="flex h-11 items-center justify-center rounded-lg border bg-white text-gray-700 transition hover:bg-gray-100"
          >
            <Maximize2 size={18} />
          </button>

          {/* Open */}
          <button
            onClick={() =>
              window.open(
                `https://leetcode.com/problems/${question.titleSlug}`,
                "_blank"
              )
            }
            title="Open on LeetCode"
            className="flex h-11 items-center justify-center rounded-lg border border-black-300 bg-white text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowRightToLine size={18} />
          </button>

          {/* Complete */}
          <button
            disabled={mutation.isPending}
            onClick={toggleCompleted}
            title={
              question.completed
                ? "Mark Incomplete"
                : "Mark Complete"
            }
            className={`flex h-11 items-center justify-center rounded-lg border transition ${
              question.completed
              ? "border-black-500 bg-gray-100 text-gray-800 hover:bg-gray-200"
              : "border-black-500 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {mutation.isPending ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : question.completed ? (
              <X size={18} />
            ) : (
              <Check size={18} />
            )}
          </button>

          {/* Reattempt */}
          <button
            disabled={
              mutation.isPending || !question.completed
            }
            onClick={toggleReattempt}
            title={
              question.completed
                ? "Toggle Needs Reattempt"
                : "Complete the question first"
            }
            className={`flex h-11 items-center justify-center rounded-lg border transition ${
              !question.completed
                ? "cursor-not-allowed border-gray-200 text-gray-300"
                : question.needsReattempt
                ? "border-black-500 bg-black-50 text-black-600"
                : "border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Status */}
        <div className="mt-3 border-t pt-3">
          <div className="flex justify-center">
            <span
              className={`whitespace-nowrap text-sm font-medium ${
                question.completed
                  ? "text-black-600"
                  : "text-gray-500"
              }`}
            >
              {question.completed
                ? completedAt
                : "Not Solved"}
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
);
}