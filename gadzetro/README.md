# Gadzetro

Gadzetro is a React and Vite e-commerce application.

## Getting started

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

Use `npm run build` to create a production build and `npm run preview` to serve it locally.

## Source layout

- `src/app/` - application routing and setup
- `src/components/` - shared UI and components grouped by feature
- `src/context/` and `src/hooks/` - application state and reusable React hooks
- `src/data/` and `src/services/` - catalog data and application services
- `src/pages/` - route-level pages grouped by feature
- `src/styles/` - global and feature styles
- `src/utils/` - shared formatting, validation, and storage helpers

## Images

Images are served from `public/images/`. Update the corresponding image path in `src/data/` when changing an asset. Missing product images use `public/images/placeholder.svg` as a fallback.
