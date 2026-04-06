import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { STORAGE_KEYS } from '../constants/storage';
import { getProgressSnapshot } from '../utils/progress';
import { loadJson } from '../utils/storage';

const highlights = [
  {
    title: 'Computer Science',
    description:
      'Practice questions from COS 101, COS 102, CSC 201, and other core CS modules.'
  },
  {
    title: 'Software Engineering',
    description: 'Master SEN 101, SEN 201, and related engineering courses with tailored mocks.'
  },
  {
    title: 'Business Management',
    description: 'Prepare for BUS 101 and other management courses with curated exam-style sets.'
  }
];

function HomePage() {
  const [session, setSession] = useState(null);
  const progress = useMemo(() => getProgressSnapshot(session), [session]);

  useEffect(() => {
    const savedSession = loadJson(STORAGE_KEYS.session);
    if (!savedSession) return;
    setSession(savedSession);
  }, []);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-slate-50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
              <span className="text-sm font-black">M</span>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Miva<span className="text-brand-500">Prep</span>
            </span>
          </div>
          {progress ? (
            <Link
              to="/progress"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Resume Test
            </Link>
          ) : (
            <Link
              to="/setup"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Start Practice
            </Link>
          )}
        </div>
      </nav>

      <PageContainer wide>
        {progress && (
          <section className="mx-auto mt-8 w-full max-w-4xl rounded-2xl border border-brand-100 bg-brand-50/40 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-brand-700">In Progress</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  You answered {progress.answered}/{progress.total} questions.
                </p>
              </div>
              <Link
                to="/progress"
                className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                Continue Test
              </Link>
            </div>
          </section>
        )}

        <section className="flex flex-col items-center gap-10 py-20 lg:py-28">
          <div className="mx-auto w-full max-w-4xl text-center">
            <h1 className="mx-auto max-w-2xl text-4xl font-black leading-[1.2] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Ace your exams with
              <br />
              <span className="bg-gradient-to-r from-brand-500 to-cyan-500 bg-clip-text py-2 text-transparent">
                Miva-tailored mocks.
              </span>
            </h1>
            <p className="mx-auto mt-6 text-base leading-relaxed text-slate-500 sm:text-lg lg:max-w-2xl">
              Practice Comp Sci, Soft Eng, and other MIVA faculties with explanation-first quizzes.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row lg:gap-8">
              <Link
                to="/setup"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-brand-500/30 transition-all hover:-translate-y-1 hover:bg-brand-600"
              >
                Start Exam Practice
              </Link>
              <p className="text-sm font-bold text-slate-500">Practice COS102, SEN101 and more</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mb-14 text-center">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-brand-500">
              Faculty Specific
            </h2>
            <p className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Built for MIVA students.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:border-brand-100 hover:shadow-xl hover:shadow-brand-500/5"
              >
                <h3 className="mt-4 text-2xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </PageContainer>
    </div>
  );
}

export default HomePage;
