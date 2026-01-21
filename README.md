# FitCal

FitCal is a Vite + React + TypeScript rebuild of the FitCal app with offline-first persistence and a modular, scalable structure.

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS
- Zustand state management
- IndexedDB (with localStorage fallback)
- React Router
- Recharts

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Lint & Format

```bash
npm run lint
npm run format
```

## Deploy to GitHub Pages

The repo includes a GitHub Actions workflow that builds and deploys to the `gh-pages` branch.

```bash
npm run build
```

The workflow sets the base path to `/<repo-name>/` for SPA routing on GitHub Pages.

## Project Structure

```
src/
  components/   # shared UI components
  db/           # IndexedDB helpers
  pages/        # routed pages
  store/        # Zustand store
  styles/       # Tailwind base styles
  utils/        # shared helpers
```
