import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { questionCounts, quizModes } from '../constants/options';
import { STORAGE_KEYS } from '../constants/storage';
import { getProgressSnapshot } from '../utils/progress';
import { getQuestionCatalog } from '../utils/questions';
import { loadJson, saveJson } from '../utils/storage';

function SetupPage() {
  const navigate = useNavigate();
  const { questions, facultyOptions } = useMemo(() => getQuestionCatalog(), []);
  const session = useMemo(() => loadJson(STORAGE_KEYS.session), []);
  const progress = useMemo(() => getProgressSnapshot(session), [session]);
  const [category, setCategory] = useState(facultyOptions[0]?.value ?? 'all');
  const [count, setCount] = useState(questionCounts[0]);
  const [mode, setMode] = useState(quizModes[0].value);

  function handleSubmit(event) {
    event.preventDefault();

    // keeps setup in local storage so quiz page can continue from it
    const setup = { category, count: Number(count), mode };
    saveJson(STORAGE_KEYS.setup, setup);
    localStorage.removeItem(STORAGE_KEYS.session);
    localStorage.removeItem(STORAGE_KEYS.result);
    navigate('/quiz');
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
          Practice Setup
        </p>
      </header>

      <section className="mx-auto w-full max-w-2xl rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 sm:p-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Configure your mock exam
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Select your faculty and course to start practicing.
        </p>

        {questions.length === 0 && (
          <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            No question JSON was found in <code>src/data/questions</code>. Add a file to continue.
          </p>
        )}

        {progress && (
          <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
            <p className="text-xs font-black uppercase tracking-widest text-brand-700">Unfinished Test</p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {progress.answered}/{progress.total} answered. Continue where you stopped.
            </p>
            <div className="mt-3">
              <Link
                to="/progress"
                className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                Open Progress
              </Link>
            </div>
          </div>
        )}

        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="category">
                Faculty / Course
              </label>
              <select
                id="category"
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {facultyOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="count">
                Question Count
              </label>
              <select
                id="count"
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
              >
                {questionCounts.map((value) => (
                  <option key={value} value={value}>
                    {value} Questions
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="mb-4 text-sm font-bold text-slate-700">Exam Mode</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quizModes.map((item) => (
                <label
                  key={item.value}
                  className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 p-5 transition-all hover:border-brand-300 hover:bg-brand-50/30"
                >
                  <input
                    className="mt-1 size-5 accent-brand-500"
                    type="radio"
                    name="mode"
                    value={item.value}
                    checked={mode === item.value}
                    onChange={(event) => setMode(event.target.value)}
                  />
                  <span>
                    <span className="block text-base font-bold text-slate-900">{item.title}</span>
                    <span className="mt-1 block text-sm text-slate-600">{item.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-12"
            disabled={questions.length === 0}
          >
            Build My Mock
          </button>
        </form>
      </section>
    </PageContainer>
  );
}

export default SetupPage;
