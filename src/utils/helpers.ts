export const generateId = () =>
  `${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}-${Date.now()}`;

export const formatTime = (date: Date) =>
  date.toLocaleTimeString('bg-BG', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDate = (date: Date) =>
  date.toLocaleDateString('bg-BG', {
    day: '2-digit',
    month: 'short',
  });

export const formatFullDate = (date: Date) =>
  date.toLocaleDateString('bg-BG', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const calcDurationMinutes = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 60000));
};

export const groupByDate = <T>(
  items: T[],
  getDate: (item: T) => string,
) => {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = getDate(item);
    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, {});
};

export const toIsoDate = (date: Date) => date.toISOString().split('T')[0];
