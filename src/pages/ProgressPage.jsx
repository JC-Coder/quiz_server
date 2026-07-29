import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { departments, levels, quizModes } from '../constants/options';
import { getProgressSnapshot, formatSavedAt } from '../utils/progress';
import { getQuestionCatalog } from '../utils/questions';
import {
  loadPendingSessions,
  migrateLegacySessionIfPresent,
  removeSessionById,
  saveSessions
} from '../utils/sessions';

const { courseOptions } = getQuestionCatalog();

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
    <div className="min-h-screen bg-[#fbfaf7] text-[#151c2b]">
      <PageContainer>
      <header className="mb-12 flex items-center justify-between sm:mb-16">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#657083] transition hover:text-[#1265e8]"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          Back to home
        </Link>
        <Link
          to="/"
          className="text-[15px] font-semibold tracking-[-0.02em] text-[#313a4a]"
          aria-label="Miva Prep home"
        >
          Miva<span className="text-[#1265e8]">Prep</span>
        </Link>
      </header>

      {!hasPending && (
        <section className="mx-auto w-full max-w-xl border-t border-[#dfe3e8] py-14 text-center sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1265e8]">
            Saved tests
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#182235] sm:text-4xl">
            No pending tests
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-[#687080]">
            Start a practice test and your progress will be saved here automatically.
          </p>
          <div className="mt-7">
            <Link
              to="/setup"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1265e8] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(18,101,232,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0d56ca]"
            >
              Start a test
            </Link>
          </div>
        </section>
      )}

      {hasPending && (
        <section className="mx-auto w-full max-w-[920px]">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-[#dfe3e8] pb-7 sm:mb-10 sm:pb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1265e8]">
                Your progress
              </p>
              <h1 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.04em] text-[#182235] sm:text-[40px]">
                Pending tests
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#687080]">
                Continue from where you stopped.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-[#8a4b4b] transition hover:bg-[#f8ece9] hover:text-[#733737]"
              onClick={clearAllProgress}
            >
              Clear all
            </button>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => {
              const snapshot = getProgressSnapshot(session);
              if (!snapshot) return null;

              const courseLabel =
                courseOptions.find((item) => item.value === session.setup?.category)?.label ??
                session.setup?.category;
              const departmentLabel =
                departments.find((item) => item.value === session.setup?.department)?.label ??
                'Not recorded';
              const levelLabel =
                levels.find((item) => item.value === session.setup?.level)?.label ?? 'Not recorded';
              const modeLabel =
                quizModes.find((item) => item.value === session.setup?.mode)?.title ?? 'Unknown mode';

              return (
                <article
                  key={session.id}
                  className="rounded-[22px] border border-[#e1e5ea] bg-white p-5 shadow-[0_8px_24px_rgba(25,34,51,0.04)] sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                        <span className="rounded-full bg-[#edf4ff] px-2.5 py-1 text-[#1265e8]">
                          {modeLabel}
                        </span>
                        <span className="text-[#7a8392]">
                          {snapshot.answered} of {snapshot.total} answered
                        </span>
                      </div>
                      <h2 className="mt-4 text-lg font-semibold leading-7 tracking-[-0.02em] text-[#1c2433] sm:text-xl">
                        {courseLabel}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-[#687080]">
                        {departmentLabel} · {levelLabel}
                      </p>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <p className="text-xs font-medium text-[#9299a5]">Last saved</p>
                      <p className="mt-1 text-sm font-medium text-[#505969]">
                        {formatSavedAt(session.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e8ebef]"
                      role="progressbar"
                      aria-label={`${snapshot.percent}% complete`}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={snapshot.percent}
                    >
                      <div
                        className="h-full rounded-full bg-[#1265e8] transition-all duration-500"
                        style={{ width: `${snapshot.percent}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-xs font-medium tabular-nums text-[#687080]">
                      {snapshot.percent}%
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#edf0f3] pt-4 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      className="inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-[#737b89] transition hover:bg-[#f4f5f7] hover:text-[#8a4b4b]"
                      onClick={() => discardProgress(session.id)}
                    >
                      Discard
                    </button>
                    <Link
                      to={`/quiz?sessionId=${encodeURIComponent(session.id)}`}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#1265e8] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(18,101,232,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0d56ca]"
                    >
                      Resume test
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
      </PageContainer>
    </div>
  );
}

export default ProgressPage;
