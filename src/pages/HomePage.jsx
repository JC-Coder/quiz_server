import { Link } from 'react-router-dom';

const benefits = [
  {
    number: '01',
    title: 'Choose a course',
    description: 'Select the Miva course you want to practise and choose how many questions to answer.',
  },
  {
    number: '02',
    title: 'Set up your test',
    description: 'Use study mode to check each answer immediately, or exam mode to see your results at the end.',
  },
  {
    number: '03',
    title: 'Review your answers',
    description: 'Check your score, read the explanations, and return to any unfinished test later.',
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
      <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fbfaf7] text-[#151c2b]">
      <header className="relative z-50 border-b border-[#151c2b]/[0.07] bg-[#fbfaf7]/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Miva Prep home">
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#1265e8] text-sm font-black text-white shadow-[0_6px_18px_rgba(18,101,232,0.22)]">
              M
            </span>
            <span className="text-[17px] font-extrabold tracking-[-0.03em]">
              Miva<span className="text-[#1265e8]">Prep</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/progress"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[#4e5666] transition hover:bg-white hover:text-[#151c2b] sm:px-4"
            >
              <span className="sm:hidden">Progress</span>
              <span className="hidden sm:inline">My progress</span>
            </Link>
            <Link
              to="/setup"
              className="rounded-full bg-[#151c2b] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1265e8] sm:px-5"
            >
              Start practice
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative">
          <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#dcecff]/60 blur-[110px]" />
          <div className="relative mx-auto grid max-w-[1180px] items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 lg:pb-28 lg:pt-24">
            <div className="max-w-[620px]">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#1265e8]/15 bg-white/80 px-3 py-1.5 text-xs font-bold text-[#1265e8] shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4a640]" />
                Practice questions for Miva students
              </div>

              <h1 className="text-[44px] font-black leading-[0.98] tracking-[-0.055em] text-[#111827] sm:text-[64px] lg:text-[72px]">
                Prepare for your
                <span className="mt-2 block text-[#1265e8]">next Miva exam.</span>
              </h1>

              <p className="mt-7 max-w-[560px] text-[17px] leading-8 text-[#596171] sm:text-lg">
                Choose a course, answer practice questions, and review the correct answers before your exam.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/setup"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#1265e8] px-7 text-base font-bold text-white shadow-[0_14px_30px_rgba(18,101,232,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0d56ca]"
                >
                  Start a test
                  <ArrowIcon />
                </Link>
                <Link
                  to="/progress"
                  className="inline-flex min-h-14 items-center justify-center rounded-full px-6 text-sm font-bold text-[#303849] transition hover:bg-white"
                >
                  View saved tests
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#697181]">
                <span className="flex items-center gap-2">
                  <span className="text-[#15a06c]">✓</span> No sign-up
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[#15a06c]">✓</span> Two test modes
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[#15a06c]">✓</span> Tests saved
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] lg:mx-0">
              <div className="absolute -right-16 -top-14 h-44 w-44 rounded-full bg-[#f9cf87]/35 blur-3xl" />
              <div className="absolute -bottom-12 -left-14 h-48 w-48 rounded-full bg-[#9edfc5]/30 blur-3xl" />

              <div className="relative rotate-[1.2deg] rounded-[32px] bg-[#182235] p-3 shadow-[0_32px_70px_rgba(22,31,49,0.20)] sm:p-4">
                <div className="overflow-hidden rounded-[24px] bg-white">
                  <div className="flex items-center justify-between border-b border-[#e9edf3] px-5 py-4 sm:px-7">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#1265e8]">COS 101</p>
                      <p className="mt-1 text-sm font-bold text-[#252d3d]">Study mode</p>
                    </div>
                    <span className="rounded-full bg-[#f0f5ff] px-3 py-1.5 text-xs font-bold text-[#1265e8]">
                      4 of 10
                    </span>
                  </div>

                  <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-8 sm:pt-7">
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e9edf3]">
                      <div className="h-full w-[40%] rounded-full bg-[#1265e8]" />
                    </div>
                    <p className="mt-6 text-lg font-extrabold leading-7 tracking-[-0.02em] text-[#182235] sm:text-xl">
                      Which component is known as the brain of the computer?
                    </p>

                    <div className="mt-5 space-y-2.5">
                      {['A. Random Access Memory', 'B. Central Processing Unit', 'C. Solid State Drive'].map((answer, index) => (
                        <div
                          key={answer}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold ${
                            index === 1
                              ? 'border-[#1265e8] bg-[#eef5ff] text-[#0d56ca]'
                              : 'border-[#e4e8ee] text-[#596171]'
                          }`}
                        >
                          {answer}
                          {index === 1 && (
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1265e8] text-[11px] text-white">✓</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl bg-[#edf9f4] p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#12805a]">Why?</p>
                      <p className="mt-1.5 text-sm leading-6 text-[#426157]">
                        The CPU processes instructions and coordinates the computer&apos;s operations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1265e8]">How it works</p>
            <h2 className="mt-4 text-3xl font-black leading-[1.08] tracking-[-0.04em] text-[#151c2b] sm:text-4xl lg:whitespace-nowrap lg:text-[clamp(2.5rem,4vw,3rem)]">
              Choose a course and start practising.
            </h2>
          </div>

          <div className="mt-10 grid border-t border-[#ccd2dc] md:grid-cols-3 sm:mt-12">
            {benefits.map((benefit) => (
              <article
                key={benefit.number}
                className="border-b border-[#ccd2dc] py-8 md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0"
              >
                <span className="text-sm font-black text-[#1265e8]">{benefit.number}</span>
                <h3 className="mt-7 text-xl font-black tracking-[-0.025em] text-[#1c2433]">{benefit.title}</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-7 text-[#687080]">{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-5 pb-5 sm:px-8 sm:pb-8">
          <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[32px] bg-[#1265e8] px-6 py-14 text-center text-white sm:px-10 sm:py-20">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/70">Ready to practise?</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-black leading-[1.05] tracking-[-0.045em] sm:text-5xl">
              Start a Miva practice test.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/75">
              Choose your course, test mode, and number of questions. You can stop and continue later.
            </p>
            <Link
              to="/setup"
              className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-bold text-[#0d56ca] transition hover:-translate-y-0.5 hover:bg-[#f7f9ff]"
            >
              Start practising
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-8 text-sm text-[#7a8290] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-semibold text-[#4e5666]">MivaPrep</p>
        <p>Independent practice tool for Miva students.</p>
      </footer>
    </div>
  );
}

export default HomePage;
