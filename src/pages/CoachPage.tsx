import { useMemo, useState } from 'react';
import { Card, PrimaryButton } from '../components/Ui';
import { useFitCalStore } from '../store/useFitCalStore';
import { calculateVolume, getSessionsInRange } from '../utils/analytics';

const tips = [
  {
    title: 'Клек с щанга',
    content: 'Дръж гърба неутрален и контролирай спускането.',
  },
  {
    title: 'Лежанка',
    content: 'Стегни лопатките и натискай с крака за стабилност.',
  },
  {
    title: 'Тяга',
    content: 'Запази щангата близо до тялото и активирай коремната преса.',
  },
  {
    title: 'Набирания',
    content: 'Започни от пълно разгъване и дръж напрежение в гърба.',
  },
];

export const CoachPage = () => {
  const { sessions, settings, updateSettings } = useFitCalStore();
  const [feeling, setFeeling] = useState('');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const analysis = useMemo(() => {
    const recentSessions = getSessionsInRange(sessions, 14);
    const lastWeek = getSessionsInRange(sessions, 7);
    const volume14 = recentSessions.reduce(
      (acc, session) => acc + calculateVolume(session),
      0,
    );
    const volume7 = lastWeek.reduce(
      (acc, session) => acc + calculateVolume(session),
      0,
    );

    let risk = 'Нисък';
    const suggestions = [] as string[];

    if (lastWeek.length >= 5) {
      risk = 'Среден';
      suggestions.push('Помисли за допълнителен ден почивка.');
    }
    if (volume7 > volume14 / 2 && volume14 > 0) {
      risk = 'Повишен';
      suggestions.push('Намали обема с 10-20% за следващата седмица.');
    }
    if (lastWeek.length >= 6) {
      risk = 'Висок';
      suggestions.push('Планирай делoad или мобилност.');
    }

    if (suggestions.length === 0) {
      suggestions.push('Темпото изглежда стабилно. Продължавай така!');
    }

    return { risk, suggestions };
  }, [sessions]);

  const filteredTips = tips.filter((tip) =>
    tip.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">AI Треньор</h2>
        <p className="text-sm text-slate-400">
          Бърз преглед на натоварването и препоръки.
        </p>
        <input
          value={feeling}
          onChange={(event) => setFeeling(event.target.value)}
          placeholder="Как се чувстваш тази седмица?"
          className="mt-4 w-full rounded-xl border border-white/10 bg-base px-4 py-3 text-sm"
        />
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Overtraining анализ</h3>
        <div className="mt-3 rounded-xl border border-white/10 bg-base px-4 py-3">
          <p className="text-sm text-slate-300">
            Риск: <span className="font-semibold text-accent">{analysis.risk}</span>
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
            {analysis.suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">План генерация</h3>
        <textarea
          value={settings.aiCoachPlan}
          onChange={(event) =>
            updateSettings({ aiCoachPlan: event.target.value })
          }
          placeholder="AI планът ще се появи тук"
          className="mt-3 w-full rounded-xl border border-white/10 bg-base px-4 py-3 text-sm"
          rows={4}
        />
        <PrimaryButton
          className="mt-4"
          onClick={() =>
            updateSettings({
              aiCoachPlan: feeling
                ? `План за ${feeling}: 2 дни сила, 1 ден мобилност.`
                : 'Фокус върху стабилно натоварване и възстановяване.',
            })
          }
        >
          Генерирай план
        </PrimaryButton>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Техники</h3>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Търсене на техника"
          className="mt-3 w-full rounded-xl border border-white/10 bg-base px-4 py-3 text-sm"
        />
        <div className="mt-4 space-y-2">
          {filteredTips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl border border-white/10 bg-base px-4 py-3"
            >
              <button
                className="flex w-full items-center justify-between text-left text-sm font-semibold"
                onClick={() =>
                  setExpandedTip((prev) =>
                    prev === tip.title ? null : tip.title,
                  )
                }
              >
                <span>{tip.title}</span>
                <span>{expandedTip === tip.title ? '−' : '+'}</span>
              </button>
              {expandedTip === tip.title && (
                <p className="mt-2 text-sm text-slate-400">{tip.content}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
