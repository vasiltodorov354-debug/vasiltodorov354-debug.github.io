import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchModal } from './SearchModal';

const titles: Record<string, string> = {
  '/': 'Тренировка',
  '/program': 'Програма',
  '/history': 'История',
  '/stats': 'Статистики',
  '/nutrition': 'Хранене',
  '/coach': 'AI Треньор',
  '/settings': 'Настройки',
};

export const Header = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="gradient-header sticky top-0 z-30 border-b border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            FitCal
          </p>
          <h1 className="text-2xl font-semibold text-white">
            {titles[location.pathname] ?? 'FitCal'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Глобално търсене"
          >
            Търсене
          </button>
          <Link
            to="/settings"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Настройки
          </Link>
        </div>
      </div>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};
