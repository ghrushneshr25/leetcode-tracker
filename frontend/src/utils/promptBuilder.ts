import type { Question } from "../types/question";
import type { QuestionNotes } from "../types/questionNotes";

function decode(text?: string) {
  return (
    text
      ?.replace(/\\u003c/g, "<")
      .replace(/\\u003e/g, ">")
      .replace(/\\n/g, "\n") ?? ""
  );
}

export type PromptType =
  | "INTERVIEW"
  | "HINTS"
  | "REVIEW";

export function buildPrompt(
  question: Question,
  notes?: QuestionNotes,
  type: PromptType = "INTERVIEW",
) {
  const examples =
    question.examples
      ?.map(
        (example) => `
Example ${example.number}

Input:
${decode(example.input)}

Output:
${decode(example.output)}

Explanation:
${decode(example.explanation)}
`,
      )
      .join("\n") ?? "";

  const constraints = decode(question.constraints);

  const followUp = decode(question.followUp);

  const header = `
# Problem

Title:
${question.questionFrontendId}. ${question.title}

Difficulty:
${question.difficulty}

Description:
${decode(question.parsedDescription)}

${examples}

Constraints

${constraints}

${followUp ? `Follow Up\n${followUp}` : ""}
`;

  switch (type) {
    case "HINTS":
      return `
You are a Senior Software Engineer.

${header}

I am practicing for coding interviews.

Do NOT give me the solution.

Instead:

1. Explain the problem in simple terms.
2. Give me small hints one by one.
3. Ask guiding questions.
4. Tell me what data structures I should think about.
5. Don't reveal the optimal algorithm unless I ask.
`;

    case "REVIEW":
      return `
You are reviewing my LeetCode solution.

${header}

# My Algorithm

${notes?.algorithm ?? "Not provided"}

# Time Complexity

${notes?.timeComplexity ?? "Not provided"}

# Space Complexity

${notes?.spaceComplexity ?? "Not provided"}

# Notes

${notes?.notes ?? "Not provided"}

Please:

1. Review my reasoning.
2. Verify my complexities.
3. Mention flaws.
4. Mention missed edge cases.
5. Suggest improvements.
6. Tell me if this would pass a coding interview.
`;

    default:
      return `
You are a Senior Software Engineer conducting a technical interview.

${header}

Help me solve this problem.

Rules:

1. Do NOT immediately reveal the optimal solution.
2. Explain the problem.
3. Explain patterns involved.
4. Ask guiding questions.
5. Explain brute force.
6. Explain why brute force is bad.
7. Explain the optimal intuition.
8. Explain the optimal algorithm.
9. Analyze time complexity.
10. Analyze space complexity.
11. Mention common mistakes.
12. Mention edge cases.
13. Mention similar LeetCode problems.
14. Finally provide Go implementations.
`;
  }
}