import { useEffect, useMemo, useState } from "react";

import { Save } from "lucide-react";

import { useQuestionNotes } from "../hooks/useQuestionNotes";
import { useUpdateQuestionNotes } from "../hooks/useUpdateQuestionNotes";

interface Props {
  questionId: number;
}

export default function QuestionNotes({
  questionId,
}: Props) {
  const { data, isLoading } =
    useQuestionNotes(questionId);

  const updateMutation =
    useUpdateQuestionNotes(questionId);

  const [algorithm, setAlgorithm] =
    useState("");

  const [timeComplexity, setTimeComplexity] =
    useState("");

  const [spaceComplexity, setSpaceComplexity] =
    useState("");

  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!data) return;

    setAlgorithm(data.algorithm ?? "");
    setTimeComplexity(
      data.timeComplexity ?? ""
    );
    setSpaceComplexity(
      data.spaceComplexity ?? ""
    );
    setNotes(data.notes ?? "");
  }, [data]);

  const dirty = useMemo(() => {
    if (!data) return false;

    return (
      algorithm !== (data.algorithm ?? "") ||
      timeComplexity !==
        (data.timeComplexity ?? "") ||
      spaceComplexity !==
        (data.spaceComplexity ?? "") ||
      notes !== (data.notes ?? "")
    );
  }, [
    algorithm,
    timeComplexity,
    spaceComplexity,
    notes,
    data,
  ]);

  const save = () => {
    updateMutation.mutate({
      algorithm,
      timeComplexity,
      spaceComplexity,
      notes,
    });
  };

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">
        My Solution
      </h2>

      <div className="space-y-8 rounded-2xl border bg-gray-50 p-8">

        {/* Algorithm */}

        <div>
          <label className="mb-3 block text-lg font-semibold">
            Algorithm
          </label>

          <textarea
            rows={10}
            value={algorithm}
            disabled={isLoading}
            onChange={(e) =>
              setAlgorithm(e.target.value)
            }
            placeholder="Explain your approach step by step..."
            className="w-full rounded-xl border bg-white p-4 leading-7 outline-none transition focus:border-black"
          />
        </div>

        {/* Complexity */}

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="mb-3 block text-lg font-semibold">
              Time Complexity
            </label>

            <input
              value={timeComplexity}
              disabled={isLoading}
              onChange={(e) =>
                setTimeComplexity(
                  e.target.value
                )
              }
              placeholder="O(n)"
              className="w-full rounded-xl border bg-white p-4 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-3 block text-lg font-semibold">
              Space Complexity
            </label>

            <input
              value={spaceComplexity}
              disabled={isLoading}
              onChange={(e) =>
                setSpaceComplexity(
                  e.target.value
                )
              }
              placeholder="O(1)"
              className="w-full rounded-xl border bg-white p-4 outline-none transition focus:border-black"
            />
          </div>

        </div>

        {/* Notes */}

        <div>
          <label className="mb-3 block text-lg font-semibold">
            Notes
          </label>

          <textarea
            rows={8}
            value={notes}
            disabled={isLoading}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Mistakes, observations, optimizations, interview tips..."
            className="w-full rounded-xl border bg-white p-4 leading-7 outline-none transition focus:border-black"
          />
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t pt-6">

          <p className="text-sm text-gray-500">
            {updateMutation.isPending
              ? "Saving..."
              : dirty
              ? "Unsaved changes"
              : "Everything saved"}
          </p>

          <button
            onClick={save}
            disabled={
              updateMutation.isPending ||
              !dirty
            }
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {updateMutation.isPending
              ? "Saving..."
              : "Save Notes"}
          </button>

        </div>

      </div>
    </section>
  );
}