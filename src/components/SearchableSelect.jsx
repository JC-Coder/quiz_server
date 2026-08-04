import { useEffect, useMemo, useRef, useState } from 'react';

function SearchableSelect({ id, value, options, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selectRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);
  const matchingOptions = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!selectRef.current?.contains(event.target)) setIsOpen(false);
    }

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  function toggleMenu() {
    setSearch('');
    setIsOpen((open) => !open);
  }

  function chooseOption(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div ref={selectRef} className="relative">
      <button
        id={id}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-options`}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-left text-base text-slate-900 transition hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
        onClick={toggleMenu}
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        <span aria-hidden="true" className={`text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
          <input
            autoFocus
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setIsOpen(false);
            }}
            placeholder={`Search ${placeholder.toLowerCase()}`}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
          <div id={`${id}-options`} role="listbox" className="mt-2 max-h-52 overflow-y-auto">
            {matchingOptions.length > 0 ? (
              matchingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={`flex w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                    option.value === value ? 'bg-brand-50 text-brand-700' : 'text-slate-700'
                  }`}
                  onClick={() => chooseOption(option.value)}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-sm text-slate-500">No matches found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
