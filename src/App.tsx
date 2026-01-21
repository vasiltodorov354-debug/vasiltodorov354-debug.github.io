import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';

const WorkoutPage = lazy(() => import('./pages/WorkoutPage').then((m) => ({ default: m.WorkoutPage })));
const ProgramPage = lazy(() => import('./pages/ProgramPage').then((m) => ({ default: m.ProgramPage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const StatsPage = lazy(() => import('./pages/StatsPage').then((m) => ({ default: m.StatsPage })));
const NutritionPage = lazy(() => import('./pages/NutritionPage').then((m) => ({ default: m.NutritionPage })));
const CoachPage = lazy(() => import('./pages/CoachPage').then((m) => ({ default: m.CoachPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

export const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Layout>
      <Suspense
        fallback={
          <div className="rounded-2xl border border-white/10 bg-card p-6 text-sm text-slate-400">
            Зареждане...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<WorkoutPage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  </BrowserRouter>
);
