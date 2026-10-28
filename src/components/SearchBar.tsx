import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  shortcutHint?: string;
  id?: string;
  label?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search feed by name, animal, grain, or SKU...',
  inputRef,
  shortcutHint,
  id = 'product-search',
  label = 'Search products',
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="w-4 h-4 text-[#595C54] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-11 pl-10 ${
          shortcutHint && !value ? 'pr-14' : 'pr-9'
        } bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] placeholder:text-[#595C54]/80 focus:border-[#263C2D] transition-colors`}
      />
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="p-1 text-[#595C54] hover:text-[#292B27] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : shortcutHint ? (
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono text-[#595C54] bg-[#F7F5EF] border border-[#E4E1D8] rounded">
            {shortcutHint}
          </kbd>
        ) : null}
      </div>
    </div>
  );
}
