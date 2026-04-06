import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

const highlights = [
  {
    title: 'Computer Science',
    description:
      'Practice questions from COS 101, COS 102, CSC 201, and other core CS modules.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    )
  },
  {
    title: 'Software Engineering',
    description: 'Master SEN 101, SEN 201, and related engineering courses with tailored mocks.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>
    )
  },
  {
    title: 'Business Management',
    description: 'Prepare for BUS 101 and other management courses with curated exam-style sets.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    )
  }
];

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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
          <div className="flex items-center gap-3">
            <Link
              to="/progress"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Pending Tests
            </Link>
            <Link
              to="/setup"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Start Practice
            </Link>
          </div>
        </div>
      </nav>

      <PageContainer wide>
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

        <section className="py-20 lg:py-32">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Built specifically for
              <br />
              <span className="text-brand-500">Miva Students.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/10"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-brand-600">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-slate-500">{item.description}</p>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-brand-500 opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </article>
            ))}
          </div>
        </section>
      </PageContainer>
    </div>
  )
}

export default HomePage;
