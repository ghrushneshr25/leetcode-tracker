import { Save, LoaderCircle } from "lucide-react";

import { useQuestionNotes } from "../hooks/useQuestionNotes";
import { useUpdateQuestionNotes } from "../hooks/useUpdateQuestionNotes";

import { useEffect, useState } from "react";

interface Props {
  questionId: number;
}

export default function QuestionWorkspace({
  questionId,
}: Props) {
  const { data } = useQuestionNotes(questionId);

  const mutation = useUpdateQuestionNotes(questionId);

  const [algorithm, setAlgorithm] = useState("");
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

  const save = () => {
    mutation.mutate({
      algorithm,
      timeComplexity,
      spaceComplexity,
      notes,
    });
  };

  return (
    <div className="space-y-8">

      {/* Algorithm */}

      <section>
        <h2 className="mb-3 text-xl font-semibold">
          Algorithm
        </h2>

        <textarea
          value={algorithm}
          onChange={(e) =>
            setAlgorithm(e.target.value)
          }
          rows={10}
          placeholder="Explain your approach here..."
          className="w-full rounded-2xl border p-5 leading-7 outline-none transition focus:border-black"
        />
      </section>

      {/* Complexity */}

      <section>

        <h2 className="mb-4 text-xl font-semibold">
          Complexity
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="mb-2 block font-medium">
              Time Complexity
            </label>

            <input
              value={timeComplexity}
              onChange={(e) =>
                setTimeComplexity(
                  e.target.value
                )
              }
              placeholder="O(n)"
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Space Complexity
            </label>

            <input
              value={spaceComplexity}
              onChange={(e) =>
                setSpaceComplexity(
                  e.target.value
                )
              }
              placeholder="O(1)"
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

        </div>

      </section>

      {/* Notes */}

      <section>

        <h2 className="mb-3 text-xl font-semibold">
          Personal Notes
        </h2>

        <textarea
          rows={8}
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="Patterns, edge cases, mistakes, optimizations..."
          className="w-full rounded-2xl border p-5 leading-7 outline-none transition focus:border-black"
        />

      </section>

      {/* Save */}

      <div className="flex justify-end">

        <button
          onClick={save}
          disabled={mutation.isPending}
          className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          {mutation.isPending ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Workspace
            </>
          )}
        </button>

      </div>

    </div>
  );
}