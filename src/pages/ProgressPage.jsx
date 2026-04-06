import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { faculties, quizModes } from '../constants/options';
import { STORAGE_KEYS } from '../constants/storage';
import { getProgressSnapshot, formatSavedAt } from '../utils/progress';
import { loadJson } from '../utils/storage';

function ProgressPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const savedSession = loadJson(STORAGE_KEYS.session);
    if (!savedSession) return;
    setSession(savedSession);
  }, []);

  const snapshot = useMemo(() => getProgressSnapshot(session), [session]);
  if (!session || !snapshot) return <Navigate to="/setup" replace />;

  const facultyLabel =
    faculties.find((item) => item.value === session.setup?.category)?.label ?? session.setup?.category;
  const modeLabel = quizModes.find((item) => item.value === session.setup?.mode)?.title ?? 'Unknown mode';

  function discardProgress() {
    // clears in-progress test so user can start a fresh one
    localStorage.removeItem(STORAGE_KEYS.session);
    navigate('/setup');
  }

  return (
    <PageContainer>
      <header className="mb-10 flex items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand-600"
        >
          <span className="text-base">←</span>
          Back to Home
        </Link>
        <p className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
          Continue Test
        </p>
      </header>

      <section className="mx-auto w-full max-w-2xl rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 sm:p-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          You have an unfinished test
        </h1>
        <p className="mt-4 text-lg text-slate-600">Resume from where you stopped or start over.</p>

        <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Course</p>
          <p className="mt-2 text-base font-bold text-slate-900">{facultyLabel}</p>

          <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400">Mode</p>
          <p className="mt-2 text-base font-bold text-slate-900">{modeLabel}</p>

          <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400">Progress</p>
          <p className="mt-2 text-base font-bold text-slate-900">
            {snapshot.answered} of {snapshot.total} answered ({snapshot.percent}%)
          </p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${snapshot.percent}%` }}
            />
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400">Next Question</p>
          <p className="mt-2 text-base font-bold text-slate-900">
            Question {snapshot.currentQuestion} of {snapshot.total}
          </p>

          <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400">Last Saved</p>
          <p className="mt-2 text-base font-bold text-slate-900">{formatSavedAt(session.updatedAt)}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/quiz"
            className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600"
          >
            Resume Test
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-slate-200 hover:bg-slate-50"
            onClick={discardProgress}
          >
            Discard & Start New
          </button>
        </div>
      </section>
    </PageContainer>
  );
}

export default ProgressPage;
