import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { faculties, quizModes } from '../constants/options';
import { getProgressSnapshot, formatSavedAt } from '../utils/progress';
import {
  loadPendingSessions,
  migrateLegacySessionIfPresent,
  removeSessionById,
  saveSessions
} from '../utils/sessions';

function ProgressPage() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    migrateLegacySessionIfPresent();
    setSessions(loadPendingSessions());
  }, []);

  function discardProgress(sessionId) {
    // removes only the selected pending session
    removeSessionById(sessionId);
    setSessions(loadPendingSessions());
  }

  function clearAllProgress() {
    // clears every pending test
    saveSessions([]);
    setSessions([]);
  }

  const hasPending = sessions.length > 0;

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
          Pending Tests
        </p>
      </header>

      {!hasPending && (
        <section className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-xl shadow-slate-200/40 sm:p-12">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            No pending tests
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">Start a new practice to see it listed here.</p>
          <div className="mt-8">
            <Link
              to="/setup"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 sm:w-auto"
            >
              Start Practice
            </Link>
          </div>
        </section>
      )}

      {hasPending && (
        <section className="mx-auto w-full max-w-4xl">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Pending Tests ({sessions.length})
            </h1>
            <button
              type="button"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              onClick={clearAllProgress}
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            {sessions.map((session) => {
              const snapshot = getProgressSnapshot(session);
              if (!snapshot) return null;

              const facultyLabel =
                faculties.find((item) => item.value === session.setup?.category)?.label ??
                session.setup?.category;
              const modeLabel =
                quizModes.find((item) => item.value === session.setup?.mode)?.title ?? 'Unknown mode';

              return (
                <article
                  key={session.id}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Course</p>
                      <p className="mt-2 text-base font-bold text-slate-900">{facultyLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Mode</p>
                      <p className="mt-2 text-base font-bold text-slate-900">{modeLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Last Saved</p>
                      <p className="mt-2 text-base font-bold text-slate-900">
                        {formatSavedAt(session.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-bold text-slate-700">
                      {snapshot.answered} of {snapshot.total} answered ({snapshot.percent}%)
                    </p>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-brand-500 transition-all duration-500"
                        style={{ width: `${snapshot.percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Link
                      to={`/quiz?sessionId=${encodeURIComponent(session.id)}`}
                      className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600"
                    >
                      Resume Test
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-slate-200 hover:bg-slate-50"
                      onClick={() => discardProgress(session.id)}
                    >
                      Discard Test
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </PageContainer>
  );
}

export default ProgressPage;
