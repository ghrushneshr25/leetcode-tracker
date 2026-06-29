interface FiltersProps {
  search: string;
  difficulty: "ALL" | "EASY" | "MEDIUM" | "HARD";
  status:
  | "ALL"
  | "COMPLETED"
  | "INCOMPLETE"
  | "REATTEMPT";

  onSearchChange: (value: string) => void;
  onDifficultyChange: (
    value: "ALL" | "EASY" | "MEDIUM" | "HARD"
  ) => void;
  onStatusChange: (
    value: "ALL" | "COMPLETED" | "INCOMPLETE" | "REATTEMPT"
  ) => void;
}

export default function Filters({
  search,
  difficulty,
  status,
  onSearchChange,
  onDifficultyChange,
  onStatusChange,
}: FiltersProps) {
  return (
    <div className="mb-6 space-y-4 rounded-lg border p-4">
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Search questions..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="flex gap-4">
        <select
          value={difficulty}
          onChange={(e) =>
            onDifficultyChange(
              e.target.value as
                | "ALL"
                | "EASY"
                | "MEDIUM"
                | "HARD"
            )
          }
          className="rounded border px-3 py-2"
        >
          <option value="ALL">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(
              e.target.value as
                | "ALL"
                | "COMPLETED"
                | "INCOMPLETE"
            )
          }
          className="rounded border px-3 py-2"
        >
          <option value="ALL">All Status</option>
          <option value="COMPLETED">
            Completed
          </option>
          <option value="INCOMPLETE">
            Incomplete
          </option>
          <option value="REATTEMPT">Reattempt</option>
        </select>
      </div>
    </div>
  );
}