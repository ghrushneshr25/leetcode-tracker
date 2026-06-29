import type { Question } from "../types/question";
import { ArrowRightToLine, X } from "lucide-react";

interface Props {
  question: Question;
  onClose: () => void;
}

export default function QuestionDetails({
  question,
  onClose,
}: Props) {
  const completedAt = question.completedAt
    ? new Date(question.completedAt).toLocaleString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const difficultyClasses = {
    EASY: "border border-gray-300 bg-gray-100 text-gray-800",
    MEDIUM: "border border-gray-300 bg-gray-100 text-gray-800",
    HARD: "border border-gray-300 bg-gray-100 text-gray-800",
  };

  const decode = (text?: string) =>
    text
      ?.replace(/\\u003c/g, "<")
      .replace(/\\u003e/g, ">")
      .replace(/\\n/g, "\n") ?? "";

  const constraints = question.constraints
    ? decode(question.constraints)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/^-+\s*/, ""))
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-start justify-between border-b px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold">
              {question.questionFrontendId}. {question.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  difficultyClasses[question.difficulty]
                }`}
              >
                {question.difficulty}
              </span>

              {question.needsReattempt && (
                <span className="rounded-full px-3 py-1 text-sm font-semibold border border-gray-300 bg-gray-100 text-gray-800">
                  REATTEMPT
                </span>
              )}

              {completedAt && (
                <span className="text-sm text-gray-500">
                  Completed • {completedAt}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-gray-100"
          >
            <X size={28} />
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">

          {/* Description */}

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Description
            </h2>

            <div className="rounded-2xl border bg-gray-50 p-6">
              <p className="whitespace-pre-wrap leading-8 text-gray-700">
                {decode(question.parsedDescription)}
              </p>
            </div>
          </section>

          {/* Custom Judge */}

          {question.customJudge && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">
                Custom Judge
              </h2>

              <div className="rounded-2xl border border-black bg-white p-6">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-7">
                  {decode(question.customJudge).replace(/^Custom Judge:\s*/, "")}
                </pre>
              </div>
            </section>
          )}

          {/* Examples */}

          {!!question.examples?.length && (
            <section>
              <h2 className="mb-5 text-xl font-semibold">
                Examples
              </h2>

              <div className="space-y-6">
                {question.examples.map((example) => (
                  <div
                    key={example.number}
                    className="rounded-2xl border bg-white p-6 shadow-sm"
                  >
                    <h3 className="mb-5 text-lg font-semibold">
                      Example {example.number}
                    </h3>

                    {!!example.images?.length && (
                      <div className="mb-5 flex flex-wrap gap-4">
                        {example.images.map((img) => (
                          <div
                            key={img}
                            className="rounded-xl border bg-white p-3 shadow-sm"
                          >
                            <img
                              src={img}
                              alt=""
                              className="max-h-72 rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-4">
                      {example.input && (
                        <div>
                          <p className="mb-2 font-semibold">
                            Input
                          </p>

                          <pre className="rounded-lg bg-gray-100 p-3 font-mono text-sm whitespace-pre-wrap">
                            {decode(example.input)}
                          </pre>
                        </div>
                      )}

                      {example.output && (
                        <div>
                          <p className="mb-2 font-semibold">
                            Output
                          </p>

                          <pre className="rounded-lg bg-gray-100 p-3 font-mono text-sm whitespace-pre-wrap">
                            {decode(example.output)}
                          </pre>
                        </div>
                      )}

                      {example.explanation && (
                        <div>
                          <p className="mb-2 font-semibold">
                            Explanation
                          </p>

                          <p className="leading-7 text-gray-700">
                            {decode(example.explanation)}
                          </p>
                        </div>
                      )}

                      {!!example.notes?.length &&
                        example.notes.map((note) => (
                          <p
                            key={note}
                            className="text-gray-600"
                          >
                            {decode(note)}
                          </p>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Constraints */}

          {constraints.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">
                Constraints
              </h2>

              <div className="rounded-2xl border bg-gray-50 p-6">
                <ul className="space-y-3">
                  {constraints.map((constraint) => (
                    <li
                      key={constraint}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-gray-500" />

                      <code className="font-mono text-sm text-gray-700">
                        {constraint}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Follow-up */}

          {question.followUp && (
            <section>
              <h2 className="mb-3 text-xl font-semibold">
                Follow-up
              </h2>

              <div className="rounded-2xl border border-black-200 bg-white-50 p-6">
                <p className="leading-7 text-black-900">
                  {decode(
                    question.followUp.replace(/^Follow-up:\s*/, "")
                  )}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t bg-gray-50 px-8 py-5">
          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2 transition hover:bg-gray-100"
          >
            Close
          </button>

          <button
            onClick={() =>
              window.open(
                `https://leetcode.com/problems/${question.titleSlug}`,
                "_blank"
              )
            }
            className="flex items-center rounded-xl border px-5 py-2 transition hover:bg-gray-100"
          >
            Open on LeetCode
          </button>
        </div>
      </div>
    </div>
  );
}