interface Props {
  description: string;
}

export default function DescriptionTooltip({
  description,
}: Props) {
  const text = description
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .replace(/\\n/g, "\n");

  const sections = text.split(/\n\s*\n/);

  return (
    <div className="max-h-[600px] w-[700px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
      {sections.map((section, index) => {
        const trimmed = section.trim();

        if (!trimmed) return null;

        // Headings
        if (
          trimmed.startsWith("Example") ||
          trimmed.startsWith("Constraints")
        ) {
          return (
            <div key={index} className="mt-5">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                {trimmed}
              </h3>
            </div>
          );
        }

        // Input
        if (trimmed.startsWith("Input:")) {
          return (
            <div key={index} className="mt-3">
              <div className="font-semibold text-gray-800">
                Input
              </div>

              <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-3 text-sm">
                {trimmed.replace("Input:", "").trim()}
              </pre>
            </div>
          );
        }

        // Output
        if (trimmed.startsWith("Output:")) {
          return (
            <div key={index} className="mt-3">
              <div className="font-semibold text-gray-800">
                Output
              </div>

              <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-3 text-sm">
                {trimmed.replace("Output:", "").trim()}
              </pre>
            </div>
          );
        }

        // Explanation
        if (trimmed.startsWith("Explanation:")) {
          return (
            <div key={index} className="mt-3">
              <div className="font-semibold text-gray-800">
                Explanation
              </div>

              <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">
                {trimmed.replace("Explanation:", "").trim()}
              </p>
            </div>
          );
        }

        // Constraints
        if (trimmed.startsWith("*")) {
          return (
            <ul
              key={index}
              className="mt-2 list-disc space-y-2 pl-5 text-gray-700"
            >
              {trimmed
                .split("\n")
                .filter(Boolean)
                .map((line) => (
                  <li key={line}>
                    {line.replace("*", "").trim()}
                  </li>
                ))}
            </ul>
          );
        }

        return (
          <p
            key={index}
            className="whitespace-pre-wrap leading-7 text-gray-700"
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}