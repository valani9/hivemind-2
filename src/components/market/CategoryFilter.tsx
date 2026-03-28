'use client';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          !selected
            ? 'bg-[#00DCFA]/20 text-[#00DCFA] border border-[#00DCFA]/30'
            : 'bg-[#1e1e2e] text-gray-400 border border-transparent hover:text-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat === selected ? null : cat)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            cat === selected
              ? 'bg-[#00DCFA]/20 text-[#00DCFA] border border-[#00DCFA]/30'
              : 'bg-[#1e1e2e] text-gray-400 border border-transparent hover:text-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
