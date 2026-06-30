import { useMemo, useState } from "react";

import {
  Bot,
  Check,
  Clipboard,
  ExternalLink,
} from "lucide-react";

import type { Question } from "../types/question";
import type { QuestionNotes } from "../types/questionNotes";

import {
  buildPrompt,
  type PromptType,
} from "../utils/promptBuilder";

interface Props {
  question: Question;
  notes?: QuestionNotes;
}



export default function QuestionAI({
  question,
  notes,
}: Props) {
  const [promptType, setPromptType] =
    useState<PromptType>("INTERVIEW");

  const [copied, setCopied] =
    useState(false);

  const prompt = useMemo(
    () =>
      buildPrompt(
        question,
        notes,
        promptType,
      ),
    [question, notes, promptType]
  );

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(
      prompt
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const openChatGPT = async () => {
    await navigator.clipboard.writeText(
      prompt
    );

    window.open(
      "https://chatgpt.com",
      "_blank"
    );
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <section>

        <div className="flex items-center gap-3">

          <Bot size={28} />

          <div>
            <h2 className="text-2xl font-bold">
              AI Assistant
            </h2>

            <p className="mt-1 text-gray-500">
              Generate a prompt using the
              question and your saved
              workspace.
            </p>

          </div>

        </div>

      </section>

      {/* Prompt Type */}

      <section>

        <h3 className="mb-4 text-lg font-semibold">
          Prompt Type
        </h3>

        <div className="flex flex-wrap gap-3">

          {[
            [
              "INTERVIEW",
              "Interview Coach",
            ],
            ["HINTS", "Hints"],
            [
              "REVIEW",
              "Review My Solution",
            ],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                setPromptType(
                  value as PromptType
                )
              }
              className={`rounded-xl border px-5 py-3 transition ${
                promptType === value
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}

        </div>

      </section>

      {/* Preview */}

      <section>

        <div className="mb-3 flex items-center justify-between">

          <h3 className="text-lg font-semibold">
            Prompt Preview
          </h3>

          <span className="text-sm text-gray-500">
            {prompt.length} characters
          </span>

        </div>

        <pre className="max-h-[450px] overflow-y-auto rounded-2xl border bg-gray-50 p-6 text-sm leading-7 whitespace-pre-wrap">
          {prompt}
        </pre>

      </section>

      {/* Actions */}

      <section>

        <div className="flex justify-end gap-3">

          <button
            onClick={copyPrompt}
            className={`flex items-center gap-2 rounded-xl border px-5 py-3 transition ${
              copied
                ? "border-black bg-white text-black"
                : "hover:bg-gray-100"
            }`}
          >
            {copied ? (
              <>
                <Check size={18} />
                Copied!
              </>
            ) : (
              <>
                <Clipboard size={18} />
                Copy Prompt
              </>
            )}
          </button>

          <button
            onClick={openChatGPT}
            className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-800"
          >
            <ExternalLink size={18} />

            Open ChatGPT
          </button>

        </div>

      </section>

    </div>
  );
}