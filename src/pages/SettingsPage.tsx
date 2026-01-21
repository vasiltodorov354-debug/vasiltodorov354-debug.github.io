import { useRef, useState } from 'react';
import { Card, PrimaryButton, SecondaryButton } from '../components/Ui';
import { useFitCalStore } from '../store/useFitCalStore';
import { ConfirmModal } from '../components/ConfirmModal';

export const SettingsPage = () => {
  const {
    programDays,
    sessions,
    prs,
    foodEntries,
    favorites,
    settings,
    updateSettings,
    resetData,
    importData,
  } = useFitCalStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const exportData = () => {
    const payload = {
      programDays,
      sessions,
      prs,
      foodEntries,
      favorites,
      settings,
      activeWorkout: undefined,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fitcal-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Настройки</h2>
        <p className="text-sm text-slate-400">
          Управление на данните и предпочитанията.
        </p>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Smart progression</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.smartProgression.enabled}
              onChange={(event) =>
                updateSettings({
                  smartProgression: {
                    ...settings.smartProgression,
                    enabled: event.target.checked,
                  },
                })
              }
            />
            Включен
          </label>
          <input
            type="number"
            value={settings.smartProgression.repIncrease}
            onChange={(event) =>
              updateSettings({
                smartProgression: {
                  ...settings.smartProgression,
                  repIncrease: Number(event.target.value),
                },
              })
            }
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
            placeholder="+повторения"
          />
          <input
            type="number"
            value={settings.smartProgression.weightIncrease}
            onChange={(event) =>
              updateSettings({
                smartProgression: {
                  ...settings.smartProgression,
                  weightIncrease: Number(event.target.value),
                },
              })
            }
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
            placeholder="+кг"
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Export / Import</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <PrimaryButton onClick={exportData}>Експорт JSON</PrimaryButton>
          <SecondaryButton onClick={() => fileRef.current?.click()}>
            Импорт JSON
          </SecondaryButton>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                if (!reader.result) return;
                const data = JSON.parse(reader.result.toString());
                importData(data);
              };
              reader.readAsText(file);
            }}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-red-300">Нулирай данните</h3>
        <p className="mt-2 text-sm text-slate-400">
          Това ще изтрие всички записи от устройството.
        </p>
        <SecondaryButton
          className="mt-4 border-red-400/40 text-red-200"
          onClick={() => setConfirmOpen(true)}
        >
          Reset data
        </SecondaryButton>
      </Card>

      <ConfirmModal
        title="Сигурни ли сте?"
        description="Всички данни ще бъдат изтрити необратимо."
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          resetData();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};
