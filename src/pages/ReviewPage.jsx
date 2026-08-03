import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import MathText from '../components/MathText';
import { STORAGE_KEYS } from '../constants/storage';
import { isFormulaCategory } from '../utils/questions';
import { loadJson } from '../utils/storage';

function ReviewPage() {
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
      <header className="mb-8 flex items-center justify-between">
        <Link
          to="/result"
          className="group flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15"
        >
          <span className="text-base">←</span>
          Back to Results
        </Link>
        <p className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">
          Detailed Review
        </p>
      </header>

      <section className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-4xl">
          Answer Review
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          Deep dive into your performance and learn from each explanation.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl space-y-4">
        {result.questions.map((question, index) => {
          const answer = result.answers[index];
          const isCorrect = Boolean(answer?.isCorrect);
          const selectedText = answer ? question.options[answer.selectedIndex] : 'No answer';
          const correctText = question.options[question.answerIndex];
          const legacyMath = isFormulaCategory(question.category);

          return (
            <article
              key={question.id}
              className={`rounded-2xl border bg-white p-5 shadow-[0_8px_24px_rgba(25,34,51,0.04)] sm:p-6 ${
                isCorrect ? 'border-emerald-50' : 'border-rose-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {question.category}
                </p>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                    isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <h2 className="mt-3 text-base font-semibold leading-6 tracking-[-0.01em] text-slate-900 sm:text-lg">
                <MathText legacyMath={legacyMath}>{index + 1}. {question.question}</MathText>
              </h2>
              <div className="mt-6 flex flex-col gap-2">
                <p className={`text-sm font-medium ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Your answer:{' '}
                  <span className="ml-1 rounded-lg bg-current/10 px-2 py-0.5">
                    <MathText legacyMath={legacyMath}>{selectedText}</MathText>
                  </span>
                </p>
                {!isCorrect && (
                  <p className="text-sm font-medium text-slate-700">
                    Correct answer:{' '}
                    <span className="ml-1 rounded-lg bg-slate-100 px-2 py-0.5">
                      <MathText legacyMath={legacyMath}>{correctText}</MathText>
                    </span>
                  </p>
                )}
              </div>
              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <p className="mb-1 font-semibold text-slate-800">Explanation</p>
                <MathText legacyMath={legacyMath}>{question.explanation}</MathText>
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-10 flex justify-center">
        <Link
          to="/setup"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(18,101,232,0.18)] transition hover:-translate-y-0.5 hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15 sm:w-auto sm:px-8"
        >
          Start New Practice
        </Link>
      </div>
    </PageContainer>
  );
}

export default ReviewPage;
