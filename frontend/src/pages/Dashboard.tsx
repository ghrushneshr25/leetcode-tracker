import { useMemo, useState } from "react";

import Filters from "../components/Filters";
import QuestionList from "../components/QuestionList";
import TagFilter from "../components/TagFilter.tsx";
import { useQuestions } from "../hooks/useQuestions";

export default function Dashboard() {
  const { data: questions = [], isLoading, error } = useQuestions();
  console.log(questions);
  console.log(Array.isArray(questions));
  const [search, setSearch] = useState("");

  const [difficulty, setDifficulty] = useState<
    "ALL" | "EASY" | "MEDIUM" | "HARD"
  >("ALL");

  const [status, setStatus] = useState<
  "ALL" | "COMPLETED" | "INCOMPLETE" | "REATTEMPT"
  >("ALL");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = useMemo(() => {
    return [
      ...new Set(
        questions.flatMap((question) =>
          question.topicTags.map((tag) => tag.name)
        )
      ),
    ].sort();
  }, [questions]);

  const toggleTag = (tag: string) => {
    setSelectedTags((previous) =>
      previous.includes(tag)
        ? previous.filter((t) => t !== tag)
        : [...previous, tag]
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
        const questionTags = question.topicTags.map(
          (tag) => tag.name
        );

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
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="mb-2 text-4xl font-bold">
        LeetCode Tracker
      </h1>

      <div className="mb-8 flex gap-8">
        <div>
          <p className="text-3xl font-bold text-green-600">
            {completedCount}
          </p>
          <p className="text-sm text-gray-500">
            Solved
          </p>
        </div>

        <div>
          <p className="text-3xl font-bold text-orange-500">
            {reattemptCount}
          </p>
          <p className="text-sm text-gray-500">
            Needs Reattempt
          </p>
        </div>

        <div>
          <p className="text-3xl font-bold">
            {questions.length}
          </p>
          <p className="text-sm text-gray-500">
            Total
          </p>
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

      <QuestionList questions={filteredQuestions} />
    </div>
  );
}