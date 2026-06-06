import { useEffect, useRef, useState } from 'preact/hooks';

const STORAGE_KEY = 'age-verified';
const REDIRECT_URL = 'https://www.misterrogers.org';

export default function AgeVerificationModal() {
  const [isVisible, setIsVisible] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) !== 'true') {
        setIsVisible(true);
      }
    } catch {
      // sessionStorage unavailable — show the modal to be safe
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      confirmRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  function handleConfirm() {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Proceed even if sessionStorage is unavailable
    }
    setIsVisible(false);
  }

  function handleDeny() {
    window.location.assign(REDIRECT_URL);
  }

  if (!isVisible) return null;

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-modal-heading"
    >
      <div class="w-full max-w-md rounded-2xl bg-light-card p-8 shadow-2xl dark:bg-dark-card">
        <div class="mb-6 text-center">
          <p class="text-5xl" aria-hidden="true">🌿</p>
          <h1
            id="age-modal-heading"
            class="mt-4 text-2xl font-bold text-light-text-heading dark:text-white"
          >
            Are you 21 or older?
          </h1>
          <p class="mt-2 text-sm text-light-text-body dark:text-dark-text-body">
            You must be 21 years of age or older to enter this site. Please verify your age to
            continue.
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <button
            ref={confirmRef}
            type="button"
            onClick={handleConfirm}
            class="flex-1 cursor-pointer rounded-xl bg-[#6bba62] px-6 py-3 text-center font-semibold text-white transition-opacity hover:opacity-80"
          >
            Yes, I'm 21+
          </button>
          <button
            type="button"
            onClick={handleDeny}
            class="flex-1 cursor-pointer rounded-xl border border-light-input-border px-6 py-3 font-semibold text-light-text-body transition-colors hover:bg-light-input-bg dark:border-dark-border dark:text-dark-text-body dark:hover:bg-dark-background"
          >
            No, I'm Under 21
          </button>
        </div>

        <p class="mt-6 text-center text-xs text-light-text-body dark:text-dark-text-body">
          By entering this site you agree to our{' '}
          <a href="/links" class="underline hover:opacity-80">
            terms of use
          </a>
          .
        </p>
      </div>
    </div>
  );
}
