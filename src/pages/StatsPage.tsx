import { useMemo, useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts';
import { Card, OutlineButton, PrimaryButton } from '../components/Ui';
import { useFitCalStore } from '../store/useFitCalStore';
import {
  calculateVolume,
  getSessionsInRange,
  getStreak,
  getVolumeSeries,
  getWeeklyBuckets,
} from '../utils/analytics';
import { generateId } from '../utils/helpers';

const tabs = [
  { label: 'Седмица', days: 7 },
  { label: 'Месец', days: 30 },
  { label: 'Година', days: 365 },
  { label: 'Всички', days: Infinity },
];

export const StatsPage = () => {
  const { sessions, prs, addPr, deletePr } = useFitCalStore();
  const [activeTab, setActiveTab] = useState(0);
  const [prForm, setPrForm] = useState({
    exercise: '',
    value: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const filteredSessions = useMemo(() => {
    const days = tabs[activeTab]?.days ?? Infinity;
    return days === Infinity ? sessions : getSessionsInRange(sessions, days);
  }, [activeTab, sessions]);

  const totalVolume = filteredSessions.reduce(
    (acc, session) => acc + calculateVolume(session),
    0,
  );
  const exerciseCount = filteredSessions.reduce(
    (acc, session) =>
      acc +
      session.sections.reduce(
        (total, section) => total + section.exercises.length,
        0,
      ),
    0,
  );

  const volumeSeries = getVolumeSeries(filteredSessions);
  const weeklyBuckets = getWeeklyBuckets(filteredSessions);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Статистики</h2>
        <p className="text-sm text-slate-400">
          Проследи прогреса си във времето.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
            <OutlineButton
              key={tab.label}
              onClick={() => setActiveTab(index)}
              className={
                index === activeTab ? 'border-accent text-white' : undefined
              }
            >
              {tab.label}
            </OutlineButton>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-xs text-slate-400">Брой тренировки</p>
          <p className="mt-2 text-2xl font-semibold">
            {filteredSessions.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Упражнения</p>
          <p className="mt-2 text-2xl font-semibold">{exerciseCount}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Обем</p>
          <p className="mt-2 text-2xl font-semibold">
            {totalVolume.toFixed(0)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Серии без пропуск</p>
          <p className="mt-2 text-2xl font-semibold">
            {getStreak(filteredSessions)}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold">Обем във времето</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeSeries}>
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: '#1b1f2a',
                    borderColor: '#293040',
                  }}
                />
                <Line type="monotone" dataKey="volume" stroke="#7c5cff" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="text-base font-semibold">Тренировки по седмици</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyBuckets}>
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: '#1b1f2a',
                    borderColor: '#293040',
                  }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-base font-semibold">PRs модул</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            value={prForm.exercise}
            onChange={(event) =>
              setPrForm((prev) => ({ ...prev, exercise: event.target.value }))
            }
            placeholder="Упражнение"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={prForm.value}
            onChange={(event) =>
              setPrForm((prev) => ({
                ...prev,
                value: Number(event.target.value),
              }))
            }
            placeholder="Стойност"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={prForm.date}
            onChange={(event) =>
              setPrForm((prev) => ({ ...prev, date: event.target.value }))
            }
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm"
          />
          <PrimaryButton
            onClick={() => {
              if (!prForm.exercise || !prForm.value) return;
              addPr({
                id: generateId(),
                exercise: prForm.exercise,
                value: prForm.value,
                date: prForm.date,
              });
              setPrForm({
                exercise: '',
                value: 0,
                date: prForm.date,
              });
            }}
          >
            Добави PR
          </PrimaryButton>
        </div>

        <div className="mt-4 space-y-2">
          {prs.length === 0 ? (
            <p className="text-sm text-slate-400">
              Няма записани PRs. Добави първия си рекорд.
            </p>
          ) : (
            prs.map((pr) => (
              <div
                key={pr.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-base px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-white">{pr.exercise}</p>
                  <p className="text-xs text-slate-400">{pr.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-accent">{pr.value}</span>
                  <button
                    onClick={() => deletePr(pr.id)}
                    className="text-xs text-slate-400 hover:text-white"
                    aria-label="Изтрий PR"
                  >
                    Изтрий
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
