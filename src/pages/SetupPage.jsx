import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { departments, levels, questionCounts, quizModes } from '../constants/options';
import { STORAGE_KEYS } from '../constants/storage';
import { getQuestionCatalog } from '../utils/questions';
import { buildNewSession } from '../utils/quiz';
import { migrateLegacySessionIfPresent, upsertSession } from '../utils/sessions';
import { saveJson } from '../utils/storage';

function SetupPage() {
  const navigate = useNavigate();
  const { questions, courseOptions } = useMemo(() => getQuestionCatalog(), []);
  const [department, setDepartment] = useState(departments[0].value);
  const [level, setLevel] = useState(levels[0].value);
  const filteredCourseOptions = useMemo(
    () =>
      courseOptions.filter(
        (course) => course.departments.includes(department) && course.level === level
      ),
    [courseOptions, department, level]
  );
  const [category, setCategory] = useState(filteredCourseOptions[0]?.value ?? '');
  const [count, setCount] = useState(questionCounts[0] ?? 10);
  const [mode, setMode] = useState(quizModes[0].value);

  const availableForCategory = useMemo(() => {
    if (category === 'all') return questions.length;
    return questions.filter((question) => question.category === category).length;
  }, [category, questions]);

  const countOptions = useMemo(() => {
    if (availableForCategory <= 0) return [];

    const filtered = questionCounts.filter((option) => option <= availableForCategory);
    if (filtered.length === 0) return [availableForCategory];
    if (!filtered.includes(availableForCategory)) filtered.push(availableForCategory);
    return [...new Set(filtered)].sort((left, right) => left - right);
  }, [availableForCategory]);

  useEffect(() => {
    migrateLegacySessionIfPresent();
  }, []);

  useEffect(() => {
    if (!filteredCourseOptions.some((course) => course.value === category)) {
      setCategory(filteredCourseOptions[0]?.value ?? '');
    }
  }, [category, filteredCourseOptions]);

  useEffect(() => {
    if (!countOptions.includes(count)) {
      setCount(countOptions[0] ?? 0);
    }
  }, [count, countOptions]);

  function handleSubmit(event) {
    event.preventDefault();
    if (availableForCategory === 0) return;

    const finalCount = Math.min(Number(count), availableForCategory);
    const setup = { department, level, category, count: finalCount, mode };
    const sessionId = crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}`;
    const session = { ...buildNewSession(setup, questions), id: sessionId };

    // keeps setup/result for compatibility and stores pending sessions in collection
    saveJson(STORAGE_KEYS.setup, setup);
    localStorage.removeItem(STORAGE_KEYS.result);
    upsertSession(session);
    navigate(`/quiz?sessionId=${encodeURIComponent(sessionId)}`);
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

      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Configure your mock exam
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Select your department, level, and course to start practising.
        </p>

        {questions.length === 0 && (
          <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            No question JSON was found in <code>src/data/questions</code>. Add a file to continue.
          </p>
        )}

        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="department">
                Department
              </label>
              <select
                id="department"
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
              >
                {departments.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="level">
                Level
              </label>
              <select
                id="level"
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                value={level}
                onChange={(event) => setLevel(event.target.value)}
              >
                {levels.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="category">
                Course
              </label>
              <select
                id="category"
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {filteredCourseOptions.map((item) => (
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
                {countOptions.map((value) => (
                  <option key={value} value={value}>
                    {value} Questions
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs font-semibold text-slate-500">
                {availableForCategory} question{availableForCategory === 1 ? '' : 's'} available.
              </p>
            </div>
          </div>

          {filteredCourseOptions.length === 0 && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              No question banks are available for this department and level yet.
            </p>
          )}

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
            disabled={
              questions.length === 0 ||
              filteredCourseOptions.length === 0 ||
              availableForCategory === 0 ||
              countOptions.length === 0
            }
          >
            Build My Mock
          </button>
        </form>
      </section>
    </PageContainer>
  );
}

export default SetupPage;
