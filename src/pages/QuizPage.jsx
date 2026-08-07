import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import OptionButton from '../components/OptionButton';
import PageContainer from '../components/PageContainer';
import MathText from '../components/MathText';
import { STORAGE_KEYS } from '../constants/storage';
import { buildResult } from '../utils/quiz';
import { isFormulaCategory } from '../utils/questions';
import { getSessionById, removeSessionById, upsertSession } from '../utils/sessions';
import { saveJson } from '../utils/storage';

function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = useMemo(() => searchParams.get('sessionId'), [searchParams]);
  const [session, setSession] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      navigate('/setup', { replace: true });
      return;
    }

    const existingSession = getSessionById(sessionId);
    if (!existingSession) {
      navigate('/progress', { replace: true });
      return;
    }
    setSession(existingSession);
    const currentAnswer = existingSession.answers[existingSession.currentIndex];
    setSelectedIndex(currentAnswer?.selectedIndex ?? null);
    setLocked(existingSession.setup.mode === 'instant' && Boolean(currentAnswer));
  }, [navigate, sessionId]);

  if (!session) return null;

  const question = session.questions[session.currentIndex];
  if (!question) return <Navigate to="/result" replace />;

  function getOptionState(index) {
    if (session.setup.mode === 'instant' && locked) {
      if (index === question.answerIndex) return 'correct';
      if (index === selectedIndex) return 'wrong';
      return 'muted';
    }
    if (selectedIndex === index) return 'pending';
    return 'neutral';
  }

  function onPick(index) {
    if (locked) return;
    setSelectedIndex(index);
    if (session.setup.mode === 'instant') setLocked(true);
  }

  function onNext() {
    if (selectedIndex === null) return;

    const isCorrect = selectedIndex === question.answerIndex;
    const updatedSession = {
      ...session,
      answers: [...session.answers],
      updatedAt: new Date().toISOString()
    };

    // stores selected answer for result and review pages
    updatedSession.answers[session.currentIndex] = {
      questionId: question.id,
      selectedIndex,
      isCorrect
    };
    updatedSession.currentIndex += 1;

    if (updatedSession.currentIndex >= updatedSession.questions.length) {
      finishQuiz(updatedSession);
      return;
    }

    upsertSession(updatedSession);
    setSession(updatedSession);
    const nextAnswer = updatedSession.answers[updatedSession.currentIndex];
    setSelectedIndex(nextAnswer?.selectedIndex ?? null);
    setLocked(updatedSession.setup.mode === 'instant' && Boolean(nextAnswer));
  }

  // Preserves the current response and restores the previous question's answer state.
  function onPrevious() {
    if (session.currentIndex === 0) return;

    const updatedSession = {
      ...session,
      answers: [...session.answers],
      currentIndex: session.currentIndex - 1,
      updatedAt: new Date().toISOString()
    };

    if (selectedIndex !== null) {
      updatedSession.answers[session.currentIndex] = {
        questionId: question.id,
        selectedIndex,
        isCorrect: selectedIndex === question.answerIndex
      };
    }

    upsertSession(updatedSession);
    setSession(updatedSession);
    const previousAnswer = updatedSession.answers[updatedSession.currentIndex];
    setSelectedIndex(previousAnswer?.selectedIndex ?? null);
    setLocked(updatedSession.setup.mode === 'instant' && Boolean(previousAnswer));
  }

  // Saves the current attempt so students can view scores before all questions are answered.
  function finishQuiz(updatedSession) {
    const result = buildResult(updatedSession);
    saveJson(STORAGE_KEYS.result, result);
    removeSessionById(updatedSession.id);
    navigate('/result');
  }

  function onEndQuiz() {
    const updatedSession = {
      ...session,
      answers: [...session.answers],
      updatedAt: new Date().toISOString()
    };

    if (selectedIndex !== null) {
      updatedSession.answers[session.currentIndex] = {
        questionId: question.id,
        selectedIndex,
        isCorrect: selectedIndex === question.answerIndex
      };
    }

    finishQuiz(updatedSession);
  }

  const isCorrectSelection = selectedIndex === question.answerIndex;
  const progress = ((session.currentIndex + 1) / session.questions.length) * 100;
  const legacyMath = isFormulaCategory(question.category);

  return (
    <PageContainer>
      <header className="mx-auto mb-6 w-full max-w-3xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Question {session.currentIndex + 1} of {session.questions.length}
            </p>
            <p className="mt-1 text-xs font-medium text-brand-600">
              {session.setup.mode === 'instant' ? 'Instant Feedback' : 'End Review'}
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-brand-200 bg-brand-50 px-3.5 text-xs font-semibold text-brand-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
              onClick={onEndQuiz}
            >
              End Quiz &amp; See Score
            </button>
            <Link
              to="/setup"
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
            >
              Quit Quiz
            </Link>
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <section className="mx-auto w-full max-w-3xl rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-[0_12px_36px_rgba(25,34,51,0.06)] sm:p-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-500">{question.category}</p>
        <h1 className="mt-3 text-[1.35rem] font-semibold leading-[1.38] tracking-[-0.025em] text-slate-900 sm:text-[1.75rem] sm:leading-[1.32]">
          <MathText legacyMath={legacyMath}>{question.question}</MathText>
        </h1>

        <div className="mt-8 space-y-3">
          {question.options.map((option, index) => (
            <OptionButton
              key={`${question.id}-${index}`}
              text={option}
              index={index}
              state={getOptionState(index)}
              disabled={session.setup.mode === 'instant' ? locked : false}
              legacyMath={legacyMath}
              onClick={() => onPick(index)}
            />
          ))}
        </div>

        {session.setup.mode === 'instant' && locked && (
          <div
            aria-live="polite"
            className={`mt-6 rounded-xl border p-4 text-sm leading-6 ${
              isCorrectSelection
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {isCorrectSelection ? (
              <>
                <strong>Correct.</strong>{' '}
                <MathText legacyMath={legacyMath}>{question.explanation}</MathText>
              </>
            ) : (
              <>
                <strong>Not correct.</strong> Correct answer:{' '}
                <MathText legacyMath={legacyMath}>{question.options[question.answerIndex]}</MathText>.{' '}
                <MathText legacyMath={legacyMath}>{question.explanation}</MathText>
              </>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15 sm:w-auto"
            onClick={onPrevious}
            disabled={session.currentIndex === 0}
          >
            Back
          </button>
          <button
            type="button"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(18,101,232,0.18)] transition hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-[0_12px_24px_rgba(18,101,232,0.22)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15 sm:ml-auto sm:w-auto sm:px-8"
            onClick={onNext}
            disabled={selectedIndex === null}
          >
            {session.currentIndex + 1 === session.questions.length ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </section>
    </PageContainer>
  );
}

export default QuizPage;
