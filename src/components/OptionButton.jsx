const baseClassName =
  'group w-full rounded-2xl border px-5 py-4 text-left text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/10';

const variantClassMap = {
  neutral: 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50/50',
  pending: 'border-brand-500 bg-brand-50/50 text-brand-700 ring-2 ring-brand-500/10',
  correct: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  wrong: 'border-rose-500 bg-rose-50 text-rose-700',
  muted: 'border-slate-100 bg-slate-50/30 text-slate-300'
};

const badgeClassMap = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-400 group-hover:border-brand-200 group-hover:bg-white group-hover:text-brand-500',
  pending: 'border-brand-500 bg-white text-brand-600',
  correct: 'border-emerald-500 bg-white text-emerald-600',
  wrong: 'border-rose-500 bg-white text-rose-600',
  muted: 'border-slate-100 bg-white text-slate-300'
};

function StatusIcon({ state }) {
  if (state !== 'correct' && state !== 'wrong') return null;

  // shows check icon for correct choice and x icon for wrong choice
  if (state === 'correct') {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
          <path
            d="M5 10.5L8.3 13.8L15 7.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-700">
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M6 6L14 14M14 6L6 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function OptionButton({ text, index, state, disabled, onClick }) {
  const variant = variantClassMap[state] ? state : 'neutral';

  return (
    <button
      type="button"
      className={`${baseClassName} ${variantClassMap[variant]} ${
        disabled ? 'cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center gap-3">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
            badgeClassMap[variant]
          }`}
        >
          {String.fromCharCode(65 + index)}
        </span>
        <span className="flex-1">{text}</span>
        <StatusIcon state={variant} />
      </span>
    </button>
  );
}

export default OptionButton;
