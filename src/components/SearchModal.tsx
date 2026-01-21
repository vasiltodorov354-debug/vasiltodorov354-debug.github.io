import { useMemo, useState } from 'react';
import { useFitCalStore } from '../store/useFitCalStore';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const { programDays, sessions, foodEntries } = useFitCalStore();

  const results = useMemo(() => {
    if (!query.trim()) return [] as { label: string; meta: string }[];
    const lower = query.toLowerCase();
    const exerciseNames = new Set<string>();
    programDays.forEach((day) =>
      day.sections.forEach((section) =>
        section.exercises.forEach((exercise) => exerciseNames.add(exercise.name)),
      ),
    );
    sessions.forEach((session) =>
      session.sections.forEach((section) =>
        section.exercises.forEach((exercise) => exerciseNames.add(exercise.name)),
      ),
    );
    const foods = new Set(foodEntries.map((entry) => entry.name));

    const exerciseMatches = Array.from(exerciseNames)
      .filter((name) => name.toLowerCase().includes(lower))
      .map((name) => ({ label: name, meta: 'Упражнение' }));
    const foodMatches = Array.from(foods)
      .filter((name) => name.toLowerCase().includes(lower))
      .map((name) => ({ label: name, meta: 'Храна' }));

    return [...exerciseMatches, ...foodMatches];
  }, [foodEntries, programDays, query, sessions]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Глобално търсене</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Затвори търсенето"
          >
            ✕
          </button>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Търси упражнения или храни"
          className="mt-4 w-full rounded-xl border border-white/10 bg-base px-4 py-3 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <div className="mt-4 max-h-64 space-y-2 overflow-auto">
          {results.length === 0 ? (
            <p className="text-sm text-slate-400">
              Няма резултати. Опитай различна дума.
            </p>
          ) : (
            results.map((result) => (
              <div
                key={`${result.label}-${result.meta}`}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-base px-4 py-3 text-sm"
              >
                <span>{result.label}</span>
                <span className="text-xs text-slate-400">{result.meta}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
