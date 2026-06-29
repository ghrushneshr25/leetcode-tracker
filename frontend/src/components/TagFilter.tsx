interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export default function TagFilter({
  tags,
  selectedTags,
  onToggleTag,
}: TagFilterProps) {
  return (
    <div className="mb-6">
      <h2 className="mb-2 text-sm font-semibold text-gray-600">
        Tags
      </h2>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const selected = selectedTags.includes(tag);

          return (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                selected
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}