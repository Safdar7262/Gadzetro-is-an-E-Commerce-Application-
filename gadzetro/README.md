# Gadzetro - Gadget Store Homepage (React + Vite)

## Run
```
npm install
npm run dev
```
Open http://localhost:5173

## Images
All images live in `public/images/`. The ones included are **placeholders** with the exact filenames the code expects.
Replace a file with your own image using the same name (or change the path in `src/data/*.js`).
Missing images automatically fall back to `public/images/placeholder.svg`.

## Notes
- Only six sample products exist (as per brief), so Smartphones/Laptops show an empty-state message. Add more items in `src/data/products.js`.
- Cart state: `src/context/CartContext.jsx`, used via `src/hooks/useCart.js`.
