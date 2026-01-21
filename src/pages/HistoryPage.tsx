import { useMemo, useState } from 'react';
import { Card, OutlineButton, SecondaryButton } from '../components/Ui';
import { useFitCalStore } from '../store/useFitCalStore';
import { calcDurationMinutes, formatFullDate } from '../utils/helpers';
import { calculateVolume } from '../utils/analytics';
import { Snackbar } from '../components/Snackbar';

export const HistoryPage = () => {
  const { sessions, deleteSession, addSession } = useFitCalStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [undoSession, setUndoSession] = useState<null | {
    id: string;
    data: (typeof sessions)[number];
  }>(null);

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedId),
    [selectedId, sessions],
  );

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">История на тренировките</h2>
        <p className="text-sm text-slate-400">
          Преглед на всички завършени тренировки.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <Card>
              <p className="text-sm text-slate-400">
                Нямаш завършени сесии. Започни тренировка от раздел Тренировка.
              </p>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {session.dayName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {formatFullDate(new Date(session.startTime))}
                    </p>
                  </div>
                  <OutlineButton onClick={() => setSelectedId(session.id)}>
                    Детайли
                  </OutlineButton>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                  <span>
                    Продължителност: {calcDurationMinutes(
                      session.startTime,
                      session.endTime,
                    )}{' '}
                    мин
                  </span>
                  <span>Обем: {calculateVolume(session).toFixed(0)}</span>
                </div>
                <SecondaryButton
                  className="mt-4"
                  onClick={() => {
                    deleteSession(session.id);
                    setUndoSession({ id: session.id, data: session });
                  }}
                >
                  Изтрий
                </SecondaryButton>
              </Card>
            ))
          )}
        </div>

        <Card>
          <h3 className="text-base font-semibold text-white">Детайли</h3>
          {selectedSession ? (
            <div className="mt-4 space-y-4">
              <div className="text-sm text-slate-300">
                {formatFullDate(new Date(selectedSession.startTime))} ·{' '}
                {calcDurationMinutes(
                  selectedSession.startTime,
                  selectedSession.endTime,
                )}{' '}
                мин
              </div>
              {selectedSession.sections.map((section) => (
                <div key={section.id}>
                  <h4 className="text-sm font-semibold text-white">
                    {section.title}
                  </h4>
                  <div className="mt-2 space-y-2">
                    {section.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between text-xs text-slate-300"
                      >
                        <span>{exercise.name}</span>
                        <span>
                          {exercise.sets} x {exercise.reps}{' '}
                          {exercise.weight ? `${exercise.weight} кг` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              Избери тренировка за подробности.
            </p>
          )}
        </Card>
      </div>

      {undoSession && (
        <Snackbar
          message="Сесията е изтрита"
          actionLabel="Отмени"
          onAction={() => {
            addSession(undoSession.data);
            setUndoSession(null);
          }}
          onClose={() => setUndoSession(null)}
        />
      )}
    </div>
  );
};
