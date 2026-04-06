import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { STORAGE_KEYS } from '../constants/storage';
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
      <header className="mb-10 flex items-center justify-between">
        <Link
          to="/result"
          className="group flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand-600"
        >
          <span className="text-base">←</span>
          Back to Results
        </Link>
        <p className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
          Detailed Review
        </p>
      </header>

      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Answer Review
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Deep dive into your performance and learn from each explanation.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl space-y-6">
        {result.questions.map((question, index) => {
          const answer = result.answers[index];
          const isCorrect = Boolean(answer?.isCorrect);
          const selectedText = answer ? question.options[answer.selectedIndex] : 'No answer';
          const correctText = question.options[question.answerIndex];

          return (
            <article
              key={question.id}
              className={`rounded-[2rem] border-2 bg-white p-6 shadow-sm ${
                isCorrect ? 'border-emerald-50' : 'border-rose-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {question.category}
                </p>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-extrabold leading-tight text-slate-900">
                {index + 1}. {question.question}
              </h2>
              <div className="mt-6 flex flex-col gap-2">
                <p className={`text-sm font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Your answer: <span className="ml-1 rounded-lg bg-current/10 px-2 py-0.5">{selectedText}</span>
                </p>
                {!isCorrect && (
                  <p className="text-sm font-bold text-slate-700">
                    Correct answer: <span className="ml-1 rounded-lg bg-slate-100 px-2 py-0.5">{correctText}</span>
                  </p>
                )}
              </div>
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
                <p className="mb-1 font-bold text-slate-800">Explanation</p>
                {question.explanation}
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-12 flex justify-center">
        <Link
          to="/setup"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30 sm:w-auto sm:px-12"
        >
          Start New Practice
        </Link>
      </div>
    </PageContainer>
  );
}

export default ReviewPage;
