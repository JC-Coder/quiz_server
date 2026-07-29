import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../constants/storage';

const PROMPT_DELAY_MS = 20_000;
const DISMISSAL_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function DeveloperContact() {
  const { pathname } = useLocation();
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isLauncherVisible, setIsLauncherVisible] = useState(false);
  const isQuizActive = pathname === '/quiz';

  // Keeps feedback available without interrupting an active test.
  useEffect(() => {
    if (isQuizActive) {
      setIsPromptVisible(false);
      setIsContactVisible(false);
      setIsLauncherVisible(false);
      return undefined;
    }

    const dismissedAt = Number(localStorage.getItem(STORAGE_KEYS.feedbackDismissedAt));
    const wasRecentlyDismissed =
      Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISSAL_WINDOW_MS;

    if (wasRecentlyDismissed) {
      setIsLauncherVisible(true);
      return undefined;
    }

    const promptTimer = window.setTimeout(() => {
      setIsPromptVisible(true);
    }, PROMPT_DELAY_MS);

    return () => window.clearTimeout(promptTimer);
  }, [isQuizActive]);

  const dismissPrompt = () => {
    localStorage.setItem(STORAGE_KEYS.feedbackDismissedAt, String(Date.now()));
    setIsPromptVisible(false);
    setIsContactVisible(false);
    setIsLauncherVisible(true);
  };

  const openContact = () => {
    setIsPromptVisible(false);
    setIsContactVisible(true);
    setIsLauncherVisible(false);
  };

  if (isQuizActive) {
    return null;
  }

  return (
    <>
      {isPromptVisible && (
        <aside
          className="fixed bottom-4 left-4 right-4 z-[90] mx-auto flex max-w-md items-center gap-4 rounded-[24px] border border-[#151c2b]/10 bg-white p-4 shadow-[0_22px_60px_rgba(21,28,43,0.18)] sm:bottom-6 sm:left-auto sm:right-6 sm:mx-0"
          aria-label="MivaPrep feedback"
        >
          <img
            src="/study-buddy.png"
            alt=""
            className="h-20 w-20 shrink-0 rounded-2xl object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-5 text-[#151c2b]">
              Have an idea for MivaPrep or want to talk to the developer?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openContact}
                className="rounded-full bg-[#1265e8] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0d56ca]"
              >
                Yes, show me
              </button>
              <button
                type="button"
                onClick={dismissPrompt}
                className="rounded-full px-3 py-2 text-xs font-bold text-[#596171] transition hover:bg-[#f2f4f7]"
              >
                Not now
              </button>
            </div>
          </div>
        </aside>
      )}

      {isLauncherVisible && (
        <button
          type="button"
          onClick={openContact}
          className="fixed bottom-5 right-5 z-[80] h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-[#fbfaf7] shadow-[0_14px_35px_rgba(21,28,43,0.20)] transition hover:-translate-y-1 sm:bottom-6 sm:right-6"
          aria-label="Contact the MivaPrep developer"
        >
          <img src="/study-buddy.png" alt="" className="h-full w-full object-cover" />
        </button>
      )}

      {isContactVisible && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-[#151c2b]/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="developer-contact-title"
        >
          <div className="relative w-full max-w-xl rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(21,28,43,0.28)] sm:p-7">
            <button
              type="button"
              onClick={dismissPrompt}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-xl text-[#697181] transition hover:bg-[#f2f4f7] hover:text-[#151c2b]"
              aria-label="Close contact options"
            >
              ×
            </button>

            <img
              src="/study-buddy.png"
              alt=""
              className="h-16 w-16 rounded-2xl object-cover"
            />
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1265e8]">
              Talk to the developer
            </p>
            <h2
              id="developer-contact-title"
              className="mt-2 pr-8 text-xl font-extrabold tracking-[-0.025em] text-[#151c2b] sm:text-2xl"
            >
              Ideas and feedback are welcome.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#697181]">
              Share a feature request, report a problem, or simply say hello.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <a
                href="https://x.com/jc_coder1"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-[#dfe4eb] p-3.5 transition hover:border-[#1265e8] hover:bg-[#f6f9ff] sm:flex-col sm:items-start"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 fill-[#151c2b]"
                  aria-hidden="true"
                >
                  <path d="M18.24 2.25h3.31l-7.23 8.26 8.51 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
                </svg>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#697181]">
                    X
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-[#151c2b]">
                    @jc_coder1
                  </span>
                </span>
              </a>
              <a
                href="https://github.com/JC-Coder"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-[#dfe4eb] p-3.5 transition hover:border-[#1265e8] hover:bg-[#f6f9ff] sm:flex-col sm:items-start"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 fill-[#151c2b]"
                  aria-hidden="true"
                >
                  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
                </svg>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#697181]">
                    GitHub
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-[#151c2b]">
                    @JC-Coder
                  </span>
                </span>
              </a>
              <a
                href="https://wa.me/2349153258538"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-[#dfe4eb] p-3.5 transition hover:border-[#20a866] hover:bg-[#f1fbf6] sm:flex-col sm:items-start"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 fill-[#20a866]"
                  aria-hidden="true"
                >
                  <path d="M12 2a9.84 9.84 0 0 0-8.45 14.88L2 22l5.25-1.5A9.9 9.9 0 1 0 12 2Zm0 17.8a7.8 7.8 0 0 1-3.98-1.09l-.29-.17-3.12.89.91-3.04-.19-.31A7.8 7.8 0 1 1 12 19.8Zm4.28-5.85c-.23-.12-1.38-.68-1.59-.76-.21-.08-.37-.12-.52.12-.16.23-.61.76-.75.92-.14.15-.27.17-.51.05-.23-.12-.98-.36-1.87-1.16a7.08 7.08 0 0 1-1.3-1.62c-.14-.24-.02-.36.1-.48.11-.1.24-.27.36-.41.12-.14.15-.24.23-.39.08-.16.04-.3-.02-.42-.06-.12-.52-1.26-.72-1.72-.19-.46-.38-.39-.52-.4h-.45c-.16 0-.41.06-.63.29-.21.23-.82.8-.82 1.96s.84 2.28.96 2.44c.12.15 1.66 2.53 4.02 3.55.56.24 1 .39 1.34.5.56.18 1.07.15 1.48.09.45-.07 1.38-.57 1.57-1.11.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
                </svg>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#697181]">
                    WhatsApp
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-[#151c2b]">
                    Message me
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeveloperContact;
