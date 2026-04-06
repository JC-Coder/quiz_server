import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import OptionButton from '../components/OptionButton';
import PageContainer from '../components/PageContainer';
import { STORAGE_KEYS } from '../constants/storage';
import { buildNewSession, buildResult } from '../utils/quiz';
import { getQuestionCatalog } from '../utils/questions';
import { loadJson, saveJson } from '../utils/storage';

function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions: allQuestions } = useMemo(() => getQuestionCatalog(), []);
  const [session, setSession] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const setup = loadJson(STORAGE_KEYS.setup);
    if (!setup) {
      navigate('/setup', { replace: true });
      return;
    }

    const retry = new URLSearchParams(location.search).get('retry') === '1';
    const existingSession = retry ? null : loadJson(STORAGE_KEYS.session);

    if (existingSession) {
      // keeps backward compatibility with sessions saved before timestamps existed
      const hydratedSession = {
        ...existingSession,
        startedAt: existingSession.startedAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveJson(STORAGE_KEYS.session, hydratedSession);
      setSession(hydratedSession);
      return;
    }

    // creates a fresh session when there is no in-progress quiz
    const newSession = buildNewSession(setup, allQuestions);
    if (newSession.questions.length === 0) {
      navigate('/setup', { replace: true });
      return;
    }
    saveJson(STORAGE_KEYS.session, newSession);
    setSession(newSession);
  }, [allQuestions, location.search, navigate]);

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
      const result = buildResult(updatedSession);
      saveJson(STORAGE_KEYS.result, result);
      localStorage.removeItem(STORAGE_KEYS.session);
      navigate('/result');
      return;
    }

    saveJson(STORAGE_KEYS.session, updatedSession);
    setSession(updatedSession);
    setSelectedIndex(null);
    setLocked(false);
  }

  const isCorrectSelection = selectedIndex === question.answerIndex;
  const progress = ((session.currentIndex + 1) / session.questions.length) * 100;

  return (
    <PageContainer>
      <header className="mx-auto mb-8 w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Question {session.currentIndex + 1} of {session.questions.length}
            </p>
            <p className="mt-1 text-xs font-semibold text-brand-600">
              {session.setup.mode === 'instant' ? 'Instant Feedback' : 'End Review'}
            </p>
          </div>
          <div className="text-right">
            <Link to="/setup" className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Quit Quiz
            </Link>
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <section className="mx-auto w-full max-w-2xl rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 sm:p-12">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500">{question.category}</p>
        <h1 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
          {question.question}
        </h1>

        <div className="mt-10 space-y-4">
          {question.options.map((option, index) => (
            <OptionButton
              key={`${question.id}-${index}`}
              text={option}
              index={index}
              state={getOptionState(index)}
              disabled={session.setup.mode === 'instant' ? locked : false}
              onClick={() => onPick(index)}
            />
          ))}
        </div>

        {session.setup.mode === 'instant' && locked && (
          <div
            className={`mt-8 rounded-2xl border p-6 text-base leading-relaxed ${
              isCorrectSelection
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {isCorrectSelection ? (
              <>
                <strong>Correct.</strong> {question.explanation}
              </>
            ) : (
              <>
                <strong>Not correct.</strong> Correct answer: {question.options[question.answerIndex]}.{' '}
                {question.explanation}
              </>
            )}
          </div>
        )}

        <button
          className="mt-10 inline-flex w-full items-center justify-center rounded-2xl bg-brand-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-12"
          onClick={onNext}
          disabled={selectedIndex === null}
        >
          {session.currentIndex + 1 === session.questions.length ? 'Finish Quiz' : 'Next Question'}
        </button>
      </section>
    </PageContainer>
  );
}

export default QuizPage;
