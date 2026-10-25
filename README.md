# Pharma Tool Frontend

React 18, TypeScript, Vite, and MUI regulatory intelligence prototype. Data is served from the in-memory mock store by default; no backend is required.

## Requirements

- Node.js 22.13+ (or Node 20.19+)
- npm

## Run locally

```powershell
npm install
Copy-Item .env.example .env.development
npm run dev
```

Run the automated checks with:

```powershell
npm test
npm run lint
npm run build
```

## Environment variables

| Variable        | Default                        | Purpose                                                   |
| --------------- | ------------------------------ | --------------------------------------------------------- |
| `VITE_API_URL`  | `http://localhost:8080/api/v1` | Spring Boot API base URL                                  |
| `VITE_USE_MOCK` | `true`                         | Use mock services when true; call API services when false |
| `VITE_APP_NAME` | `Pharma Tool`                  | Application display name                                  |

Variables prefixed with `VITE_` are public in the browser. Do not put secrets in them. Only `.env.example` should be committed.

## Demo accounts

Password for all accounts: `Demo@123`

| Role                                              | Email                     |
| ------------------------------------------------- | ------------------------- |
| Admin                                             | `admin@pharmatool.demo`   |
| Developer                                         | `dev@pharmatool.demo`     |
| Client                                            | `client@pharmatool.demo`  |
| Temporary (expires in 7 days)                     | `guest@pharmatool.demo`   |
| Expired temporary (demonstrates expiry rejection) | `expired@pharmatool.demo` |

## Main sections

- Summaries: `/summaries`
- Dietary Supplements: `/dietary-supplements`
- Documents: `/documents`
- Operations: `/operations/*`
- Summaries Dashboard: `/summaries-dashboard`
- Document Upload: `/document-upload`

## Deployment

The repository includes `vercel.json` for SPA rewrites and security headers. In Vercel, select the Vite preset, run `npm run build`, and publish `dist`. Use `VITE_USE_MOCK=true` for the prototype. Set it to `false` and provide the deployed API URL once the backend is available.

## Prototype notes

- Mock records reset on page reload; the prototype session is kept in `sessionStorage`.
- Frontend permission checks are for user experience only. The backend must independently enforce authorization.
- Production authentication should use secure `httpOnly` cookies instead of browser-accessible token storage.
- Regulatory and supplement mock records are illustrative; consult authoritative sources for current requirements.
