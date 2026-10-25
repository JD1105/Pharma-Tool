# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Vistar Frontend Prototype

  React 18, TypeScript, Vite, and MUI regulatory intelligence prototype. By default, all data is served from the in-memory mock store; no backend is required.

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

  | Variable | Default | Purpose |
  |---|---|---|
  | `VITE_API_URL` | `http://localhost:8080/api/v1` | Spring Boot API base URL |
  | `VITE_USE_MOCK` | `true` | Use mock services when true; use Axios API services when false |
  | `VITE_APP_NAME` | `Vistar` | Application name shown in the interface |

  Variables prefixed with `VITE_` are public in the browser. Do not put secrets in them. Only `.env.example` should be committed.

  ## Demo accounts

  Password for all accounts: `Demo@123`

  | Role | Email |
  |---|---|
  | Admin | `admin@vistar.demo` |
  | Developer | `dev@vistar.demo` |
  | Client | `client@vistar.demo` |
  | Temporary (expires in 7 days) | `guest@vistar.demo` |
  | Expired temporary (demonstrates expiry rejection) | `expired@vistar.demo` |

  ## Deployment

  The repository includes `vercel.json` for SPA rewrites and the required security headers. In Vercel, select the Vite preset, run `npm run build`, and publish `dist`. Configure `VITE_USE_MOCK=true` for the prototype. Set it to `false` and provide the deployed API URL once the Spring Boot backend is available.

  ## Prototype notes

  - Mock records reset on page reload; the prototype session is kept in `sessionStorage`.
  - Frontend permission checks are for user experience only. The backend must independently enforce authorization.
  - Production authentication should use secure `httpOnly` cookies instead of browser-accessible token storage.
  - Regulatory mock records are illustrative; consult regulator publications for authoritative information.
