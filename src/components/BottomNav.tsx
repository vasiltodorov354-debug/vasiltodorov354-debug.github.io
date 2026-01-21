import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Тренировка', icon: '🏋️' },
  { to: '/program', label: 'Програма', icon: '📅' },
  { to: '/history', label: 'История', icon: '🗂️' },
  { to: '/stats', label: 'Статистики', icon: '📊' },
  { to: '/nutrition', label: 'Хранене', icon: '🥗' },
  { to: '/coach', label: 'AI Треньор', icon: '🤖' },
];

export const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-card/95 backdrop-blur">
    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-xs">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-md px-2 py-1 transition ${
              isActive ? 'text-white' : 'text-slate-400'
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`
          }
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);
