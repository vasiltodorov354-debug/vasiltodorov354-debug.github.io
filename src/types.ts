export type SectionType = 'skill' | 'strength' | 'volume' | 'cardio';

export type ExerciseEntry = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
};

export type SectionTemplate = {
  id: string;
  title: string;
  type: SectionType;
  exercises: ExerciseEntry[];
};

export type ProgramDay = {
  id: string;
  name: string;
  tags: string[];
  sections: SectionTemplate[];
};

export type WorkoutSection = {
  id: string;
  title: string;
  type: SectionType;
  exercises: ExerciseEntry[];
};

export type WorkoutSession = {
  id: string;
  dayId: string;
  dayName: string;
  startTime: string;
  endTime: string;
  sections: WorkoutSection[];
  notes?: string;
};

export type PersonalRecord = {
  id: string;
  exercise: string;
  value: number;
  date: string;
};

export type FoodEntry = {
  id: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
};

export type DailyMacros = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type SmartProgressionSettings = {
  enabled: boolean;
  repIncrease: number;
  weightIncrease: number;
};

export type UserSettings = {
  aiProgramPreference: string;
  aiNutritionGoal: 'cut' | 'bulk' | 'maintain';
  aiNutritionInfo: string;
  aiNutritionPlan: string;
  aiCoachPlan: string;
  hrEnabled: boolean;
  smartProgression: SmartProgressionSettings;
};

export type ActiveWorkout = {
  id: string;
  dayId: string;
  dayName: string;
  startTime: string;
  sections: WorkoutSection[];
  notes?: string;
};

export type FitCalState = {
  programDays: ProgramDay[];
  sessions: WorkoutSession[];
  prs: PersonalRecord[];
  foodEntries: FoodEntry[];
  favorites: {
    exercises: string[];
    foods: string[];
  };
  settings: UserSettings;
  activeWorkout?: ActiveWorkout;
};
