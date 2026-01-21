import type { WorkoutSession } from '../types';

export const getProgressionHint = (
  sessions: WorkoutSession[],
  exerciseName: string,
  repIncrease: number,
  weightIncrease: number,
) => {
  const occurrences = sessions.flatMap((session) =>
    session.sections.flatMap((section) =>
      section.exercises
        .filter((exercise) => exercise.name === exerciseName)
        .map((exercise) => ({
          reps: exercise.reps,
          sets: exercise.sets,
          weight: exercise.weight ?? 0,
        })),
    ),
  );

  if (occurrences.length < 2) return null;
  const [latest, previous] = occurrences.slice(0, 2);
  if (latest.reps === previous.reps && latest.sets === previous.sets) {
    if (latest.weight > 0) {
      return `Предложение: +${weightIncrease} кг следващия път.`;
    }
    return `Предложение: +${repIncrease} повторение следващия път.`;
  }
  return null;
};
