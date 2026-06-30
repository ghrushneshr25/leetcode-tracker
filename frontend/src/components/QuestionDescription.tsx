import type { Question } from "../types/question";

interface Props {
  question: Question;
}

export default function QuestionDescription({
  question,
}: Props) {
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
    <div className="space-y-8">

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

          <div className="rounded-2xl border bg-white p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-7">
              {decode(question.customJudge).replace(
                /^Custom Judge:\s*/,
                ""
              )}
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

                <div className="space-y-5">

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
                      <div
                        key={note}
                        className="rounded-lg bg-yellow-50 p-3 text-sm text-gray-700"
                      >
                        {decode(note)}
                      </div>
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

          <div className="rounded-2xl border bg-gray-50 p-6">
            <p className="leading-7 text-gray-700">
              {decode(
                question.followUp.replace(
                  /^Follow-up:\s*/,
                  ""
                )
              )}
            </p>
          </div>
        </section>
      )}

    </div>
  );
}