import type { WorkoutSession } from '../types';
import { toIsoDate } from './helpers';

export const calculateVolume = (session: WorkoutSession) =>
  session.sections.reduce(
    (total, section) =>
      total +
      section.exercises.reduce((sub, exercise) => {
        const weight = exercise.weight ?? 0;
        return sub + exercise.sets * exercise.reps * weight;
      }, 0),
    0,
  );

export const getSessionsInRange = (sessions: WorkoutSession[], days: number) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return sessions.filter((session) => new Date(session.startTime) >= cutoff);
};

export const getWeeklyBuckets = (sessions: WorkoutSession[]) => {
  const buckets = new Map<string, number>();
  sessions.forEach((session) => {
    const date = new Date(session.startTime);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const key = toIsoDate(weekStart);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });
  return Array.from(buckets.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, count]) => ({ date, count }));
};

export const getVolumeSeries = (sessions: WorkoutSession[]) =>
  sessions
    .map((session) => ({
      date: toIsoDate(new Date(session.startTime)),
      volume: calculateVolume(session),
    }))
    .reverse();

export const getStreak = (sessions: WorkoutSession[]) => {
  const dates = new Set(
    sessions.map((session) => toIsoDate(new Date(session.startTime))),
  );
  let streak = 0;
  const date = new Date();
  while (dates.has(toIsoDate(date))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
};
