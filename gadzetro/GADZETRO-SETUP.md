# Gadzetro: Phases 1 to 4 (combined package)

Your original homepage files are NOT included here and stay unchanged.
Only `src/main.jsx` replaces an existing file (it now mounts the router and providers).

## Install

```powershell
# 1. Extract this zip into your gadzetro project folder (choose "Replace files" for src/main.jsx)
# 2. Install the new packages (once):
npm install react-router-dom axios react-hook-form zod@3 @hookform/resolvers
# 3. Run:
npm run dev
```

## What is included
- Phase 1: router, layouts (main / account / admin), common components, mock catalog (27 products), service layer
- Phase 2: shop, category, search, product details, brands, deals, wishlist context
- Phase 3: cart (coupons, save for later), wishlist page, mock checkout, order success
- Phase 4: login, register, forgot/reset password, access denied, account pages, frontend route guards

## Demo accounts (frontend only, NOT real security)
- Customer: customer@gadzetro.demo / Customer@123
- Admin: admin@gadzetro.demo / Admin@123
- Demo coupons: WELCOME10, FLAT200, FREESHIP, BIGSAVE

## Pages still showing "Coming soon"
Informational pages (about, contact, faq, policies): Phase 5. Admin pages after login: Phase 6.

## Reset demo data
Browser DevTools -> Application -> Local Storage -> delete keys starting with `gadzetro:`.
