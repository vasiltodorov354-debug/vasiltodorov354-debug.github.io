import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ActiveWorkout,
  ExerciseEntry,
  FitCalState,
  FoodEntry,
  PersonalRecord,
  ProgramDay,
  SectionTemplate,
  UserSettings,
  WorkoutSession,
} from '../types';
import { generateId, toIsoDate } from '../utils/helpers';
import { storage } from '../db/storage';

const defaultSections = (label: string): SectionTemplate[] => [
  {
    id: generateId(),
    title: 'Скил',
    type: 'skill',
    exercises: [],
  },
  {
    id: generateId(),
    title: `Сила ${label}`,
    type: 'strength',
    exercises: [],
  },
  {
    id: generateId(),
    title: 'Обем',
    type: 'volume',
    exercises: [],
  },
  {
    id: generateId(),
    title: 'Кардио (30 мин)',
    type: 'cardio',
    exercises: [],
  },
];

const initialProgramDays: ProgramDay[] = [
  {
    id: generateId(),
    name: 'Ден 1',
    tags: ['Скил', 'Сила Push', 'Обем', 'Кардио 30 мин'],
    sections: defaultSections('Push'),
  },
  {
    id: generateId(),
    name: 'Ден 2',
    tags: ['Скил', 'Сила Pull', 'Обем', 'Кардио 30 мин'],
    sections: defaultSections('Pull'),
  },
  {
    id: generateId(),
    name: 'Ден 3',
    tags: ['Скил', 'Сила Push', 'Обем', 'Кардио 30 мин'],
    sections: defaultSections('Push'),
  },
  {
    id: generateId(),
    name: 'Ден 4',
    tags: ['Скил', 'Сила Pull', 'Обем', 'Кардио 30 мин'],
    sections: defaultSections('Pull'),
  },
  {
    id: generateId(),
    name: 'Ден 5',
    tags: ['Скил', 'Сила Push', 'Обем', 'Кардио 30 мин'],
    sections: defaultSections('Push'),
  },
];

const initialSettings: UserSettings = {
  aiProgramPreference: '',
  aiNutritionGoal: 'maintain',
  aiNutritionInfo: '',
  aiNutritionPlan: '',
  aiCoachPlan: '',
  hrEnabled: false,
  smartProgression: {
    enabled: true,
    repIncrease: 1,
    weightIncrease: 2.5,
  },
};

export type FitCalStore = FitCalState & {
  startWorkout: (dayId: string) => void;
  cancelWorkout: () => void;
  updateActiveSection: (sectionId: string, exercises: ExerciseEntry[]) => void;
  finishWorkout: () => void;
  updateProgramDay: (day: ProgramDay) => void;
  addSession: (session: WorkoutSession) => void;
  deleteSession: (id: string) => void;
  addPr: (pr: PersonalRecord) => void;
  deletePr: (id: string) => void;
  addFood: (entry: FoodEntry) => void;
  deleteFood: (id: string) => void;
  toggleFavoriteExercise: (name: string) => void;
  toggleFavoriteFood: (name: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetData: () => void;
  importData: (data: FitCalState) => void;
};

const getDefaultState = (): FitCalState => ({
  programDays: initialProgramDays,
  sessions: [],
  prs: [],
  foodEntries: [],
  favorites: {
    exercises: [],
    foods: [],
  },
  settings: initialSettings,
  activeWorkout: undefined,
});

export const useFitCalStore = create<FitCalStore>()(
  persist(
    (set, get) => ({
      ...getDefaultState(),
      startWorkout: (dayId) => {
        const day = get().programDays.find((item) => item.id === dayId);
        if (!day) return;
        const activeWorkout: ActiveWorkout = {
          id: generateId(),
          dayId: day.id,
          dayName: day.name,
          startTime: new Date().toISOString(),
          sections: day.sections.map((section) => ({
            ...section,
            exercises: section.exercises.map((exercise) => ({ ...exercise })),
          })),
        };
        set({ activeWorkout });
      },
      cancelWorkout: () => set({ activeWorkout: undefined }),
      updateActiveSection: (sectionId, exercises) => {
        const activeWorkout = get().activeWorkout;
        if (!activeWorkout) return;
        const updatedSections = activeWorkout.sections.map((section) =>
          section.id === sectionId ? { ...section, exercises } : section,
        );
        set({ activeWorkout: { ...activeWorkout, sections: updatedSections } });
      },
      finishWorkout: () => {
        const activeWorkout = get().activeWorkout;
        if (!activeWorkout) return;
        const endTime = new Date().toISOString();
        const newSession: WorkoutSession = {
          id: generateId(),
          dayId: activeWorkout.dayId,
          dayName: activeWorkout.dayName,
          startTime: activeWorkout.startTime,
          endTime,
          sections: activeWorkout.sections,
          notes: activeWorkout.notes,
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeWorkout: undefined,
        }));
      },
      updateProgramDay: (day) => {
        set((state) => ({
          programDays: state.programDays.map((item) =>
            item.id === day.id ? day : item,
          ),
        }));
      },
      addSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),
      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== id),
        })),
      addPr: (pr) => set((state) => ({ prs: [pr, ...state.prs] })),
      deletePr: (id) =>
        set((state) => ({ prs: state.prs.filter((pr) => pr.id !== id) })),
      addFood: (entry) =>
        set((state) => ({
          foodEntries: [entry, ...state.foodEntries],
        })),
      deleteFood: (id) =>
        set((state) => ({
          foodEntries: state.foodEntries.filter((entry) => entry.id !== id),
        })),
      toggleFavoriteExercise: (name) => {
        set((state) => {
          const exists = state.favorites.exercises.includes(name);
          return {
            favorites: {
              ...state.favorites,
              exercises: exists
                ? state.favorites.exercises.filter((item) => item !== name)
                : [name, ...state.favorites.exercises],
            },
          };
        });
      },
      toggleFavoriteFood: (name) => {
        set((state) => {
          const exists = state.favorites.foods.includes(name);
          return {
            favorites: {
              ...state.favorites,
              foods: exists
                ? state.favorites.foods.filter((item) => item !== name)
                : [name, ...state.favorites.foods],
            },
          };
        });
      },
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
      resetData: () => set(() => ({ ...getDefaultState() })),
      importData: (data) => set(() => ({ ...data })),
    }),
    {
      name: 'fitcal-store',
      storage: {
        getItem: async (name) => {
          const value = await storage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await storage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await storage.removeItem(name);
        },
      },
      partialize: (state) => ({
        programDays: state.programDays,
        sessions: state.sessions,
        prs: state.prs,
        foodEntries: state.foodEntries,
        favorites: state.favorites,
        settings: state.settings,
      }),
      migrate: (persistedState) => {
        if (!persistedState) return getDefaultState();
        return {
          ...getDefaultState(),
          ...persistedState,
        } as FitCalState;
      },
    },
  ),
);

export const getTodayMacros = (entries: FoodEntry[]) => {
  const today = toIsoDate(new Date());
  const todays = entries.filter(
    (entry) => entry.timestamp.split('T')[0] === today,
  );
  return todays.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fats: acc.fats + entry.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );
};
