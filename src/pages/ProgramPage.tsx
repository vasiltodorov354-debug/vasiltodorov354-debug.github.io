import { useState } from 'react';
import { Badge, Card, OutlineButton, PrimaryButton } from '../components/Ui';
import { useFitCalStore } from '../store/useFitCalStore';
import { generateId } from '../utils/helpers';
import type { SectionTemplate } from '../types';

export const ProgramPage = () => {
  const { programDays, updateProgramDay, settings, updateSettings } =
    useFitCalStore();
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">5-дневна програма</h2>
            <p className="text-sm text-slate-400">
              Редактирай дните и секциите според нуждите.
            </p>
          </div>
          <OutlineButton onClick={() => setEditMode((prev) => !prev)}>
            {editMode ? 'Готово' : 'Редакция'}
          </OutlineButton>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">AI адаптация на програмата</h3>
            <p className="text-sm text-slate-400">
              Запази предпочитания за автоматична адаптация.
            </p>
          </div>
          <PrimaryButton
            onClick={() =>
              updateSettings({
                aiProgramPreference: settings.aiProgramPreference
                  ? ''
                  : 'Фокус върху сила и мобилност',
              })
            }
          >
            {settings.aiProgramPreference ? 'Изчисти' : 'Запази'}
          </PrimaryButton>
        </div>
        <textarea
          value={settings.aiProgramPreference}
          onChange={(event) =>
            updateSettings({ aiProgramPreference: event.target.value })
          }
          placeholder="Опиши целите си за AI адаптация"
          className="mt-4 w-full rounded-xl border border-white/10 bg-base px-4 py-3 text-sm"
          rows={3}
        />
      </Card>

      <div className="space-y-4">
        {programDays.map((day) => (
          <Card key={day.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              {editMode ? (
                <input
                  value={day.name}
                  onChange={(event) =>
                    updateProgramDay({ ...day, name: event.target.value })
                  }
                  className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
                />
              ) : (
                <h3 className="text-lg font-semibold text-white">{day.name}</h3>
              )}
              <div className="flex flex-wrap gap-2">
                {day.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {day.sections.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className="rounded-xl border border-white/10 bg-base p-3"
                >
                  <div className="flex items-center justify-between">
                    {editMode ? (
                      <input
                        value={section.title}
                        onChange={(event) => {
                          const updatedSections: SectionTemplate[] =
                            day.sections.map((item, idx) =>
                              idx === sectionIndex
                                ? { ...item, title: event.target.value }
                                : item,
                            );
                          updateProgramDay({ ...day, sections: updatedSections });
                        }}
                        className="rounded-lg border border-white/10 bg-card px-3 py-2 text-sm"
                      />
                    ) : (
                      <h4 className="text-sm font-semibold text-white">
                        {section.title}
                      </h4>
                    )}
                    {editMode && (
                      <OutlineButton
                        onClick={() => {
                          const updated = day.sections.map((item, idx) =>
                            idx === sectionIndex
                              ? {
                                  ...item,
                                  exercises: [
                                    ...item.exercises,
                                    {
                                      id: generateId(),
                                      name: 'Ново упражнение',
                                      sets: 3,
                                      reps: 8,
                                    },
                                  ],
                                }
                              : item,
                          );
                          updateProgramDay({ ...day, sections: updated });
                        }}
                      >
                        + Упражнение
                      </OutlineButton>
                    )}
                  </div>
                  <div className="mt-3 space-y-2">
                    {section.exercises.length === 0 && (
                      <p className="text-xs text-slate-400">
                        Няма упражнения. Добави, когато си готов.
                      </p>
                    )}
                    {section.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{exercise.name}</span>
                        <span className="text-xs text-slate-400">
                          {exercise.sets} x {exercise.reps}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
