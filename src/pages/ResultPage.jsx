import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { STORAGE_KEYS } from '../constants/storage';
import { loadJson } from '../utils/storage';

function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedResult = loadJson(STORAGE_KEYS.result);
    if (!savedResult) {
      navigate('/setup', { replace: true });
      return;
    }

    setResult(savedResult);
  }, [navigate]);

  if (!result) return null;

  const percentage = Number(result.summary.percent ?? 0);
  const resultMessage =
    percentage >= 80
      ? 'Strong work. Review any missed questions to reinforce what you know.'
      : percentage >= 50
        ? 'Good start. Review the missed questions, then have another go.'
        : 'Keep going. Review the explanations and try the practice again.';
  const courseLabel = result.setup?.category ?? 'Practice test';

  return (
    <PageContainer>
      <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_12px_36px_rgba(25,34,51,0.06)] sm:p-9">
        <header className="text-center">
          <p className="inline-flex rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
            Quiz Complete
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-4xl">
            Your Result
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {courseLabel} · {result.summary.total} questions
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/60 px-5 py-6 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Score</p>
          <p className="mt-2 text-5xl font-semibold tracking-[-0.06em] text-brand-600 sm:text-6xl">
            {percentage}%
          </p>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {result.summary.correct} correct out of {result.summary.total}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600">{resultMessage}</p>
        </div>

        <div className="mt-8 grid grid-cols-3 divide-x divide-slate-100 border-y border-slate-100">
          <article className="py-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Correct</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-500 sm:text-3xl">
              {result.summary.correct}
            </p>
          </article>
          <article className="py-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Wrong</p>
            <p className="mt-1 text-2xl font-semibold text-rose-500 sm:text-3xl">{result.summary.wrong}</p>
          </article>
          <article className="py-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Total</p>
            <p className="mt-1 text-2xl font-semibold text-slate-700 sm:text-3xl">{result.summary.total}</p>
          </article>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/review"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(18,101,232,0.18)] transition hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
          >
            Review Answers
          </Link>
          <Link
            to="/setup"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
          >
            Start Another Practice
          </Link>
        </div>
        <Link
          to="/"
          className="mt-5 inline-flex text-sm font-medium text-slate-500 transition hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
        >
          Back to home
        </Link>
      </section>
    </PageContainer>
  );
}

export default ResultPage;
