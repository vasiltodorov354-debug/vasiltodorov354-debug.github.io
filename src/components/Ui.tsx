import { PropsWithChildren } from 'react';

export const Card = ({ children }: PropsWithChildren) => (
  <div className="rounded-2xl border border-white/10 bg-card p-4 shadow-lg shadow-black/20">
    {children}
  </div>
);

export const Badge = ({ children }: PropsWithChildren) => (
  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-200">
    {children}
  </span>
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PrimaryButton = ({ className = '', ...props }: ButtonProps) => (
  <button
    className={`rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    {...props}
  />
);

export const SecondaryButton = ({ className = '', ...props }: ButtonProps) => (
  <button
    className={`rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    {...props}
  />
);

export const OutlineButton = ({ className = '', ...props }: ButtonProps) => (
  <button
    className={`rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    {...props}
  />
);

export const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-12 rounded-full transition ${
      checked ? 'bg-accent' : 'bg-white/10'
    }`}
    aria-pressed={checked}
  >
    <span
      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
        checked ? 'left-7' : 'left-1'
      }`}
    />
  </button>
);
