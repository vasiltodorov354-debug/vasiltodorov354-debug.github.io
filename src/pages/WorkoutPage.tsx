import { useEffect, useState } from 'react';
import { Card, PrimaryButton, SecondaryButton, Toggle } from '../components/Ui';
import { useFitCalStore } from '../store/useFitCalStore';
import { generateId, formatTime } from '../utils/helpers';
import { getProgressionHint } from '../utils/progression';

export const WorkoutPage = () => {
  const {
    programDays,
    activeWorkout,
    sessions,
    settings,
    favorites,
    startWorkout,
    cancelWorkout,
    updateActiveSection,
    finishWorkout,
    updateSettings,
    toggleFavoriteExercise,
  } = useFitCalStore();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!activeWorkout) return;
    const timer = window.setInterval(() => {
      const start = new Date(activeWorkout.startTime).getTime();
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeWorkout]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  if (!activeWorkout) {
    return (
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-white">Дни от програмата</h2>
          <p className="mt-1 text-sm text-slate-400">
            Избери ден и започни тренировка.
          </p>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {programDays.map((day, index) => (
            <Card key={day.id}>
              <div
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white ${
                  [
                    'bg-red-500/20',
                    'bg-blue-500/20',
                    'bg-orange-500/20',
                    'bg-purple-500/20',
                    'bg-green-500/20',
                  ][index % 5]
                }`}
              >
                <span>{day.name}</span>
                <span className="text-xs text-slate-200">
                  {day.tags.join(' · ')}
                </span>
              </div>
              <PrimaryButton
                className="mt-4 w-full"
                onClick={() => startWorkout(day.id)}
              >
                Старт тренировка
              </PrimaryButton>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Активна тренировка</h2>
            <p className="text-sm text-slate-400">
              {activeWorkout.dayName} · Начало {formatTime(new Date(activeWorkout.startTime))}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/10 px-3 py-1 text-sm">
              ⏱️ {Math.floor(elapsedSeconds / 60)}:{`${elapsedSeconds % 60}`.padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              HR
              <Toggle
                checked={settings.hrEnabled}
                onChange={(value) => updateSettings({ hrEnabled: value })}
              />
            </div>
          </div>
        </div>
      </Card>

      {activeWorkout.sections.map((section) => (
        <Card key={section.id}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                {section.title}
              </h3>
              <p className="text-xs text-slate-400">
                Добави упражнения, серии и повторения.
              </p>
            </div>
            <button
              className="text-sm text-accent"
              onClick={() => toggleSection(section.id)}
            >
              {expandedSections.includes(section.id) ? 'Скрий' : 'Покажи'}
            </button>
          </div>

          {expandedSections.includes(section.id) && (
            <div className="mt-4 space-y-4">
              {section.exercises.map((exercise, index) => {
                const hint = settings.smartProgression.enabled
                  ? getProgressionHint(
                      sessions,
                      exercise.name,
                      settings.smartProgression.repIncrease,
                      settings.smartProgression.weightIncrease,
                    )
                  : null;
                return (
                  <div
                    key={exercise.id}
                    className="rounded-xl border border-white/10 bg-base p-3"
                  >
                    <div className="grid gap-3 md:grid-cols-6">
                      <input
                        value={exercise.name}
                        onChange={(event) => {
                          const updated = [...section.exercises];
                          updated[index] = {
                            ...exercise,
                            name: event.target.value,
                          };
                          updateActiveSection(section.id, updated);
                        }}
                        placeholder="Упражнение"
                        className="rounded-lg border border-white/10 bg-card px-3 py-2 text-sm md:col-span-2"
                      />
                      <button
                        type="button"
                        onClick={() => toggleFavoriteExercise(exercise.name)}
                        className="rounded-lg border border-white/10 bg-card px-3 py-2 text-sm"
                        aria-label="Добави към любими"
                      >
                        ☆
                      </button>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(event) => {
                          const updated = [...section.exercises];
                          updated[index] = {
                            ...exercise,
                            sets: Number(event.target.value),
                          };
                          updateActiveSection(section.id, updated);
                        }}
                        className="rounded-lg border border-white/10 bg-card px-3 py-2 text-sm"
                        placeholder="Серии"
                      />
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(event) => {
                          const updated = [...section.exercises];
                          updated[index] = {
                            ...exercise,
                            reps: Number(event.target.value),
                          };
                          updateActiveSection(section.id, updated);
                        }}
                        className="rounded-lg border border-white/10 bg-card px-3 py-2 text-sm"
                        placeholder="Повт."
                      />
                      <input
                        type="number"
                        value={exercise.weight ?? ''}
                        onChange={(event) => {
                          const updated = [...section.exercises];
                          updated[index] = {
                            ...exercise,
                            weight: event.target.value
                              ? Number(event.target.value)
                              : undefined,
                          };
                          updateActiveSection(section.id, updated);
                        }}
                        className="rounded-lg border border-white/10 bg-card px-3 py-2 text-sm"
                        placeholder="Кг"
                      />
                      <input
                        value={exercise.notes ?? ''}
                        onChange={(event) => {
                          const updated = [...section.exercises];
                          updated[index] = {
                            ...exercise,
                            notes: event.target.value,
                          };
                          updateActiveSection(section.id, updated);
                        }}
                        className="rounded-lg border border-white/10 bg-card px-3 py-2 text-sm"
                        placeholder="Бележка"
                      />
                    </div>
                    {hint && (
                      <p className="mt-2 text-xs text-emerald-300">{hint}</p>
                    )}
                  </div>
                );
              })}
              <SecondaryButton
                onClick={() => {
                  const updated = [
                    ...section.exercises,
                    {
                      id: generateId(),
                      name: '',
                      sets: 3,
                      reps: 8,
                      weight: undefined,
                    },
                  ];
                  updateActiveSection(section.id, updated);
                }}
              >
                + Добави упражнение
              </SecondaryButton>
              {favorites.exercises.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  {favorites.exercises.map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        const updated = [
                          ...section.exercises,
                          {
                            id: generateId(),
                            name,
                            sets: 3,
                            reps: 8,
                            weight: undefined,
                          },
                        ];
                        updateActiveSection(section.id, updated);
                      }}
                      className="rounded-full bg-white/10 px-3 py-1"
                    >
                      + {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      ))}

      <div className="flex flex-wrap justify-end gap-3">
        <SecondaryButton onClick={cancelWorkout}>Прекрати</SecondaryButton>
        <PrimaryButton onClick={finishWorkout}>Завърши тренировка</PrimaryButton>
      </div>
    </div>
  );
};
