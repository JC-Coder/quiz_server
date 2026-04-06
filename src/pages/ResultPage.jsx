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

  return (
    <PageContainer>
      <section className="mx-auto w-full max-w-2xl rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-200/40 sm:p-12">
        <p className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-brand-700">
          Quiz Complete
        </p>
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Your Result
        </h1>

        <div className="mt-10 flex flex-col items-center">
          <p className="text-7xl font-black tracking-tighter text-brand-500 sm:text-8xl">
            {result.summary.correct}/{result.summary.total}
          </p>
          <p className="mt-4 text-lg font-bold text-slate-500">{result.summary.percent}% score</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <article className="rounded-3xl border border-slate-100 bg-slate-50/50 p-4 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Correct</p>
            <p className="mt-2 text-2xl font-black text-emerald-500 sm:text-3xl">
              {result.summary.correct}
            </p>
          </article>
          <article className="rounded-3xl border border-slate-100 bg-slate-50/50 p-4 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wrong</p>
            <p className="mt-2 text-2xl font-black text-rose-500 sm:text-3xl">{result.summary.wrong}</p>
          </article>
          <article className="rounded-3xl border border-slate-100 bg-slate-50/50 p-4 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</p>
            <p className="mt-2 text-2xl font-black text-slate-700 sm:text-3xl">{result.summary.total}</p>
          </article>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/review"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-slate-200 hover:bg-slate-50"
          >
            Review Answers
          </Link>
          <Link
            to="/quiz?retry=1"
            className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30"
          >
            Retry Quiz
          </Link>
          <Link
            to="/setup"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-slate-200 hover:bg-slate-50 sm:col-span-2"
          >
            Start New Practice
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}

export default ResultPage;
