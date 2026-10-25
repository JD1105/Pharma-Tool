# Project: Vistar regulatory tool, frontend prototype
- Stack: React 18, Vite, TypeScript (strict), MUI, React Router v6, TanStack Query, Axios, React Hook Form + Zod, Recharts
- Follow FRONTEND_SPEC.md in the project root as the source of truth
- All data access goes through src/api/*.ts. Each function returns mock data when VITE_USE_MOCK=true, otherwise calls the real API with the same signature
- Roles: ADMIN, DEVELOPER, CLIENT, TEMP. Use can(role, permission) for UI checks and RoleGuard for routes
- Use functional components and hooks only. Keep components small. No inline styles; use the MUI theme and sx prop
- Every data view has loading, empty and error states
- Never use dangerouslySetInnerHTML. Never store secrets in code
- Keep it simple. This is a 4-hour prototype