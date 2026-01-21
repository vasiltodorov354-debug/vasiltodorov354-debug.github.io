import { useEffect } from 'react';

export const Snackbar = ({
  message,
  actionLabel,
  onAction,
  onClose,
}: {
  message: string;
  actionLabel: string;
  onAction: () => void;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = window.setTimeout(() => onClose(), 5000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-white/10 bg-card px-4 py-3 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-slate-200">{message}</span>
        <button
          onClick={onAction}
          className="text-sm font-semibold text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};
