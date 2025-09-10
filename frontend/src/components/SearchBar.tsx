import { useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      className="flex w-full gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="relative w-full">
        {/* left icon */}
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="m19 19-4-4m0-7a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* input (pad left for icon, pad right for button) */}
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask any question about clinical trials"
          className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-36 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* button sits inside on the right */}
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-10 px-5 rounded-xl bg-blue-900 text-white hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Search
        </button>
      </div>
    </form>
  );
}
