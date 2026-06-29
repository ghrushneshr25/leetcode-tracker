import { useMemo, useState } from "react";

import Filters from "../components/Filters";
import QuestionDetails from "../components/QuestionDetails";
import QuestionList from "../components/QuestionList";
import TagFilter from "../components/TagFilter";
import { ArrowUpToLine } from "lucide-react";

import { useQuestions } from "../hooks/useQuestions";

import type { Question } from "../types/question";

export default function Dashboard() {
  const { data: questions = [], isLoading, error } =
    useQuestions();

  const [selectedQuestion, setSelectedQuestion] =
    useState<Question | null>(null);

  const [search, setSearch] = useState("");

  const [difficulty, setDifficulty] = useState<
    "ALL" | "EASY" | "MEDIUM" | "HARD"
  >("ALL");

  const [status, setStatus] = useState<
    "ALL" | "COMPLETED" | "INCOMPLETE" | "REATTEMPT"
  >("ALL");

  const [selectedTags, setSelectedTags] = useState<
    string[]
  >([]);

  const tags = useMemo(() => {
    return [
      ...new Set(
        questions.flatMap((q) =>
          q.topicTags.map((tag) => tag.name)
        )
      ),
    ].sort();
  }, [questions]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      if (
        difficulty !== "ALL" &&
        question.difficulty !== difficulty
      ) {
        return false;
      }

      if (
        status === "COMPLETED" &&
        !question.completed
      ) {
        return false;
      }

      if (
        status === "INCOMPLETE" &&
        question.completed
      ) {
        return false;
      }

      if (
        status === "REATTEMPT" &&
        !question.needsReattempt
      ) {
        return false;
      }

      if (
        search &&
        !question.title
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false;
      }

      if (selectedTags.length > 0) {
        const questionTags =
          question.topicTags.map((t) => t.name);

        const hasAllTags = selectedTags.every((tag) =>
          questionTags.includes(tag)
        );

        if (!hasAllTags) {
          return false;
        }
      }

      return true;
    });
  }, [
    questions,
    difficulty,
    status,
    search,
    selectedTags,
  ]);

  const completedCount = useMemo(() => {
    return questions.filter((q) => q.completed).length;
  }, [questions]);

  const reattemptCount = useMemo(() => {
    return questions.filter(
      (q) => q.needsReattempt
    ).length;
  }, [questions]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Failed to load questions.
      </div>
    );
  }

  return (
    <>
      {selectedQuestion && (
        <QuestionDetails
          question={selectedQuestion}
          onClose={() =>
            setSelectedQuestion(null)
          }
        />
      )}

      <div
        className={`mx-auto max-w-7xl p-8 transition ${
          selectedQuestion
            ? "pointer-events-none blur-sm"
            : ""
        }`}
      >
       <div className="mb-10 flex flex-col items-center">
          <h1 className="mb-6 text-4xl font-bold">
            Leetcode Tracker
          </h1>

          <div className="flex gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {completedCount}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Solved
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold">
                {reattemptCount}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Reattempt
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold">
                {questions.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Total
              </p>
            </div>
          </div>
        </div>

        <Filters
          search={search}
          difficulty={difficulty}
          status={status}
          onSearchChange={setSearch}
          onDifficultyChange={setDifficulty}
          onStatusChange={setStatus}
        />

        <TagFilter
          tags={tags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />

        <QuestionList
          questions={filteredQuestions}
          onOpen={setSelectedQuestion}
        />

        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          title="Back to Top"
          className="fixed bottom-6 right-6 z-50 rounded-full border border-gray-300 bg-white p-3 shadow-lg transition hover:bg-gray-100"
        >
          <ArrowUpToLine size={30} />
        </button>
        
      </div>
    </>
  );
}