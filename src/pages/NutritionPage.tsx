import { useState } from 'react';
import { Card, PrimaryButton, SecondaryButton } from '../components/Ui';
import { useFitCalStore, getTodayMacros } from '../store/useFitCalStore';
import { generateId, formatTime } from '../utils/helpers';

export const NutritionPage = () => {
  const {
    foodEntries,
    addFood,
    deleteFood,
    favorites,
    toggleFavoriteFood,
    settings,
    updateSettings,
  } = useFitCalStore();
  const [form, setForm] = useState({
    name: '',
    grams: 100,
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const macros = getTodayMacros(foodEntries);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Днешни макроси</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-xl bg-base px-4 py-3 text-sm">
            Калории: <span className="font-semibold">{macros.calories}</span>
          </div>
          <div className="rounded-xl bg-base px-4 py-3 text-sm">
            Протеин: <span className="font-semibold">{macros.protein}</span>
          </div>
          <div className="rounded-xl bg-base px-4 py-3 text-sm">
            Въглехидрати: <span className="font-semibold">{macros.carbs}</span>
          </div>
          <div className="rounded-xl bg-base px-4 py-3 text-sm">
            Мазнини: <span className="font-semibold">{macros.fats}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Добави храна</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Име на храна"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={form.grams}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                grams: Number(event.target.value),
              }))
            }
            placeholder="Грамаж"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={form.calories}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                calories: Number(event.target.value),
              }))
            }
            placeholder="Калории"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={form.protein}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                protein: Number(event.target.value),
              }))
            }
            placeholder="Протеин"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={form.carbs}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                carbs: Number(event.target.value),
              }))
            }
            placeholder="Въглехидрати"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={form.fats}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                fats: Number(event.target.value),
              }))
            }
            placeholder="Мазнини"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <PrimaryButton
            onClick={() => {
              if (!form.name) return;
              addFood({
                id: generateId(),
                ...form,
                timestamp: new Date().toISOString(),
              });
              setForm({
                name: '',
                grams: 100,
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
              });
            }}
          >
            Добави
          </PrimaryButton>
          <SecondaryButton
            onClick={() =>
              toggleFavoriteFood(form.name || 'Любима храна')
            }
          >
            ☆ Запази във фаворити
          </SecondaryButton>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Любими храни</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {favorites.foods.length === 0 ? (
            <p className="text-sm text-slate-400">
              Няма добавени любими.
            </p>
          ) : (
            favorites.foods.map((food) => (
              <button
                key={food}
                onClick={() => setForm((prev) => ({ ...prev, name: food }))}
                className="rounded-full bg-white/10 px-3 py-1 text-sm"
              >
                {food}
              </button>
            ))
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Дневник</h3>
        <div className="mt-4 space-y-3">
          {foodEntries.length === 0 ? (
            <p className="text-sm text-slate-400">
              Няма записани хранения за днес.
            </p>
          ) : (
            foodEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-base px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{entry.name}</p>
                  <p className="text-xs text-slate-400">
                    {entry.grams} г · {formatTime(new Date(entry.timestamp))}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span>{entry.calories} kcal</span>
                  <button
                    onClick={() => deleteFood(entry.id)}
                    className="text-xs text-slate-400 hover:text-white"
                    aria-label="Изтрий храна"
                  >
                    Изтрий
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">AI хранителен план</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <select
            value={settings.aiNutritionGoal}
            onChange={(event) =>
              updateSettings({
                aiNutritionGoal: event.target.value as
                  | 'cut'
                  | 'bulk'
                  | 'maintain',
              })
            }
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          >
            <option value="cut">Cut</option>
            <option value="bulk">Bulk</option>
            <option value="maintain">Maintain</option>
          </select>
          <input
            value={settings.aiNutritionInfo}
            onChange={(event) =>
              updateSettings({ aiNutritionInfo: event.target.value })
            }
            placeholder="Свободен текст"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          />
        </div>
        <PrimaryButton
          className="mt-4"
          onClick={() =>
            updateSettings({
              aiNutritionPlan: `План за ${settings.aiNutritionGoal}: ${settings.aiNutritionInfo || 'Стабилен баланс'}`,
            })
          }
        >
          Генерирай план
        </PrimaryButton>
        {settings.aiNutritionPlan && (
          <div className="mt-4 rounded-xl bg-base px-4 py-3 text-sm text-slate-200">
            {settings.aiNutritionPlan}
          </div>
        )}
      </Card>
    </div>
  );
};
