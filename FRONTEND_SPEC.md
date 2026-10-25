# Vistar Tool: Frontend Specification

> **Purpose:** This file is the single source of truth for building the Vistar frontend prototype.
> Give it to GitHub Copilot (Agent mode) and build it **step by step in the order of Section 14**.
> **Scope:** Frontend only. The backend (Java Spring Boot) comes later, so this frontend must run fully on **mock data** and switch to the real API with one environment variable.
> **Time budget:** about 4 hours. Keep it simple, clean and professional. Do not over-engineer.

---

## 1. Product Overview

Vistar is a **regulatory intelligence platform for the pharma industry**. Users search, compare and track regulatory information (guidances, regulations, news, associations, ingredient data, country updates), manage regulatory projects, and upload documents.

**Users:** Admin, Tool Developer, Client, and Temporary (time-limited) users.

**Design goals:** professional, trustworthy, data-dense but uncluttered. Think "enterprise regulatory software", not a marketing site.

---

## 2. Tech Stack (Frontend)

| Concern | Choice |
|---|---|
| Framework | React 18 + **TypeScript** |
| Build tool | Vite |
| UI library | **MUI (Material UI) v5/v6** with a custom theme |
| Routing | React Router v6 |
| Server state | TanStack Query (React Query) |
| HTTP | Axios (with interceptors) |
| Forms | React Hook Form + Zod |
| Tables | MUI DataGrid (community edition) |
| Charts | Recharts |
| Icons | `@mui/icons-material` |
| Linting | ESLint + Prettier |
| Hosting | **Vercel** (SPA) |

**Install command (reference):**
```bash
npm create vite@latest . -- --template react-ts
npm i @mui/material @mui/icons-material @mui/x-data-grid @emotion/react @emotion/styled
npm i react-router-dom @tanstack/react-query axios react-hook-form zod @hookform/resolvers recharts dayjs
```

---

## 3. Folder Structure

All files live inside `tool-frontend/`.

```
tool-frontend/
├── .github/
│   └── copilot-instructions.md
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── theme/
│   │   └── theme.ts
│   ├── config/
│   │   ├── env.ts                 # reads VITE_* variables
│   │   ├── menu.ts                # role -> menu items config
│   │   └── permissions.ts         # role -> permission map
│   ├── types/
│   │   └── index.ts               # shared TypeScript types
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── useAuth.ts
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleGuard.tsx
│   ├── api/
│   │   ├── client.ts              # axios instance + interceptors
│   │   ├── authApi.ts
│   │   ├── ingredientApi.ts
│   │   ├── regulatoryApi.ts       # used by Summarize, HUNT, Dashboard
│   │   ├── documentApi.ts
│   │   ├── countryUpdateApi.ts
│   │   ├── projectApi.ts
│   │   ├── userApi.ts             # admin user management
│   │   └── auditApi.ts
│   ├── mocks/
│   │   ├── db.ts                  # in-memory mock data store
│   │   ├── ingredients.ts
│   │   ├── regulatoryItems.ts
│   │   ├── countryUpdates.ts
│   │   ├── projects.ts
│   │   ├── users.ts
│   │   └── delay.ts               # simulates network latency
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── PageHeader.tsx
│   │   ├── common/
│   │   │   ├── FilterBar.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── ResultActions.tsx  # download / bookmark / share
│   │   │   ├── CompareDialog.tsx
│   │   │   ├── StatusChip.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── PrototypeBanner.tsx
│   │   └── feedback/
│   │       └── Toast.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── ForbiddenPage.tsx
│   │   ├── summarize/SummarizePage.tsx
│   │   ├── ingredients/IngredientPage.tsx
│   │   ├── hunt/HuntPage.tsx
│   │   ├── ri-operations/
│   │   │   ├── ImpactAssessmentPage.tsx
│   │   │   ├── WatchlistPage.tsx
│   │   │   ├── ProjectsPage.tsx    # tabs: Dashboard / Projects / Tasks
│   │   │   └── RiDocumentsPage.tsx
│   │   ├── summarize-dashboard/SummarizeDashboardPage.tsx
│   │   ├── document-upload/DocumentUploadPage.tsx
│   │   ├── country-updates/CountryUpdatesPage.tsx
│   │   ├── cmc/CmcDashboardPage.tsx
│   │   └── admin/
│   │       ├── UserManagementPage.tsx
│   │       └── AuditLogPage.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useToast.ts
│   ├── utils/
│   │   ├── format.ts
│   │   └── download.ts
│   └── routes/
│       └── AppRoutes.tsx
├── .env.example
├── .env.development
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── README.md
```

---

## 4. Environment Variables

`.env.example`
```
VITE_API_URL=http://localhost:8080/api/v1
VITE_USE_MOCK=true
VITE_APP_NAME=Vistar
```

- `VITE_USE_MOCK=true`: every `api/*.ts` file returns data from `src/mocks`.
- `VITE_USE_MOCK=false`: every `api/*.ts` file calls the real backend via Axios.
- **Each API file must expose the same function signatures in both modes**, so pages never know the difference.
- Never put secrets in `VITE_*` variables. Everything with that prefix is public in the browser.

---

## 5. Design System and Theme

Create `src/theme/theme.ts` with the MUI `createTheme`.

| Token | Value |
|---|---|
| Primary | `#1F3A5F` (deep navy) |
| Primary light | `#3F6EA8` |
| Secondary / accent | `#0E9AA7` (teal) |
| Success | `#2E7D32` |
| Warning | `#ED6C02` |
| Error | `#D32F2F` |
| Background | `#F4F6F9` |
| Paper | `#FFFFFF` |
| Text primary | `#1B2733` |
| Font | `Inter`, fallback `Roboto, Arial, sans-serif` |
| Border radius | `8px` |

**Rules**
- Light theme only (dark mode is out of scope).
- Cards use a 1px border `#E3E8EF` and almost no shadow.
- Table headers use a light grey background and bold text.
- Buttons: no uppercase text transform. Primary actions are contained, secondary are outlined.
- Spacing: use the MUI 8px grid consistently.
- Page layout: fixed left sidebar (260px), a top bar (64px), and a content area with `max-width: 1400px`.

---

## 6. Roles and Access Matrix

Roles: `ADMIN`, `DEVELOPER`, `CLIENT`, `TEMP`.

| Module / Route | ADMIN | DEVELOPER | CLIENT | TEMP |
|---|:---:|:---:|:---:|:---:|
| Summarize | ✅ | ✅ | ✅ | ✅ (read-only) |
| Ingredient DB | ✅ | ✅ | ✅ | ✅ (read-only) |
| HUNT | ✅ | ✅ | ✅ | ✅ (no bookmark/share) |
| RI Operations | ✅ | ✅ | ✅ | ❌ |
| Summarize Dashboard | ✅ | ✅ | ✅ (View, View Activity) | ❌ |
| Review action | ✅ | ✅ | ✅ | ❌ |
| Document Upload | ✅ | ✅ | ✅ | ❌ |
| Country Updates | ✅ | ✅ | ✅ | ✅ (read-only) |
| CMC Dashboard | ✅ | ✅ | ✅ | ❌ |
| Admin: User Management | ✅ | ❌ | ❌ | ❌ |
| Admin: Audit Log | ✅ | ✅ | ❌ | ❌ |

Implement in `config/permissions.ts` as a permission map (for example `"document:upload": ["ADMIN","DEVELOPER","CLIENT"]`) plus a helper `can(role, permission)`. UI elements (buttons, tabs) use `can()`, and routes use `RoleGuard`.

**Temporary user behaviour**
- Show a banner at the top: `Temporary access: expires on <date>`.
- If `validUntil` is in the past, login is rejected with the message "Your temporary access has expired. Please contact your administrator."
- Write actions are hidden or disabled.

> Note: frontend checks are only for UX. The backend must enforce all permissions again.

---

## 7. Authentication (Frontend)

- `LoginPage`: email and password form with validation (Zod), a loading state, and error messages. Centered card layout with the Vistar logo/name and a short tagline.
- `AuthContext` holds `user` (`id, name, email, role, tenant, validUntil`), `token`, `login()`, `logout()`, `isAuthenticated`.
- **Token storage (prototype):** keep in memory and mirror to `sessionStorage`, so a refresh keeps the session but closing the tab clears it. Add a comment in the code that production should use `httpOnly` secure cookies.
- Axios request interceptor adds `Authorization: Bearer <token>`.
- Axios response interceptor: on `401` log out and redirect to `/login`, and on `403` show the Forbidden page or a toast.
- **Idle timeout:** log out after 30 minutes of inactivity, with a warning dialog at 28 minutes.
- `ProtectedRoute` redirects unauthenticated users to `/login` and returns them to the original page after login.
- Show a "Use demo account" helper on the login page (only when `VITE_USE_MOCK=true`) listing the demo credentials.

**Mock demo accounts**

| Role | Email | Password |
|---|---|---|
| Admin | admin@vistar.demo | Demo@123 |
| Developer | dev@vistar.demo | Demo@123 |
| Client | client@vistar.demo | Demo@123 |
| Temp | guest@vistar.demo | Demo@123 (expires in 7 days) |

Also add one expired temp user (`expired@vistar.demo`) so the expiry flow can be demonstrated.

---

## 8. Layout and Navigation

**`AppLayout`** = Sidebar + Topbar + `<Outlet />`.

**Sidebar** (menu items filtered by role from `config/menu.ts`):
1. Summarize
2. Ingredient DB
3. HUNT
4. RI Operations (expandable: Impact Assessment, Watchlist, Projects, Documents)
5. Summarize Dashboard
6. Document Upload
7. Country Updates
8. CMC Dashboard
9. Admin section (visible to Admin/Developer only): User Management, Audit Log

- Highlight the active route. Collapsible to icons on small screens. On mobile (< 900px) the sidebar becomes a temporary drawer.

**Topbar:** page title or breadcrumb on the left; on the right a notification icon (mock), the user's name, role chip and an avatar menu (Profile (disabled), Logout).

**PrototypeBanner:** a slim strip under the topbar reading `Prototype: sample data only`, shown when `VITE_USE_MOCK=true`.

---

## 9. Pages and Requirements

### 9.1 Summarize (`/summarize`)
Per the sitemap: Search, Compare.
- **Filters:** Industry, Business Area, Country (multi-select dropdowns) plus a keyword box.
- **Industry options:** Pharmaceuticals, Biotech, Medical Devices, Cosmetics, Nutraceuticals, Food Supplements.
- **Business Area options:** Regulatory Affairs, Quality, CMC, Clinical, Pharmacovigilance, Labeling.
- **Results:** card list or table showing title, country, industry, short summary, date, and a status chip. Pagination.
- **Compare:** select up to 3 results with checkboxes, then click **Compare** to open `CompareDialog` with a side-by-side table.
- Empty state: "No results match your filters."

### 9.2 Ingredient DB (`/ingredients`)
Per the sitemap: Search, Compare, Reports.
- **Search box:** ingredient name (debounced 400ms). Also match synonyms and CAS number in mock logic.
- **Filters:** Type (Active API, Excipient, Preservative, Colorant, Flavour), Country.
- **Table columns:** Name, CAS Number, Type, Country, Status (Approved / Restricted / Banned / Under Review), Last Updated, and a row action menu.
- **Compare:** select 2 to 3 ingredients, then open `CompareDialog` (side-by-side by country and status).
- **Reports tab:** simple report builder. Choose ingredients and countries, then click **Generate Report**, which shows a preview table plus a **Download CSV** button (client-side generation).
- Tabs: `Search` | `Reports`.

### 9.3 HUNT (`/hunt`)
Per the sitemap: Filter 1 (Guidances & Regulations, Updates/News, Associations), Filter 2 (Country), result actions.
- **Filter 1:** segmented control or tabs: `Guidances & Regulations` | `Updates / News` | `Associations`.
- **Filter 2:** Country dropdown, plus a keyword search.
- **Result list:** each result shows title, source (for example FDA, EMA, CDSCO), country, published date, and a snippet.
- **`ResultActions` on every result:**
  - **Download:** downloads a mock text/PDF file.
  - **Bookmark:** toggles, with the icon state persisted in mock storage per user.
  - **Share:** copies a link to the clipboard and shows a toast "Link copied".
- A "Bookmarked only" toggle in the filter bar.
- TEMP role: hide Bookmark and Share.

### 9.4 RI Operations (`/ri-operations/*`)
Sub-pages from the sitemap:

**Impact Assessment (`/ri-operations/impact-assessment`)**
- Table of assessments: Title, Regulation, Country, Impact Level (High / Medium / Low chip), Owner, Due Date, Status.
- "New Assessment" button opens a form dialog (title, regulation, country, impact level, owner, due date, notes). Saving adds a row in the mock store.

**Watchlist (`/ri-operations/watchlist`)**
- List of watched regulations or topics with country, last change, and an "Unwatch" action.
- "Add to watchlist" dialog with a topic and country selection.
- Show a "New change" badge on items with recent updates.

**Projects (`/ri-operations/projects`)** with three tabs:
- **Dashboard:** summary cards (Active Projects, Open Tasks, Overdue Tasks, Completed) plus a Recharts bar chart (tasks by status) and a donut chart (projects by country).
- **Projects:** table with Name, Owner, Country, Status, Progress bar, Due Date. "New Project" dialog.
- **Tasks:** table or Kanban-style list (To Do / In Progress / Done) with assignee and due date, and a "New Task" dialog.

**Documents (`/ri-operations/documents`)**
- Table of project-related documents (name, type, project, uploaded by, date) with a Download action and a search box.

### 9.5 Summarize Dashboard (`/summarize-dashboard`)
Per the sitemap: Filters, table of all records, and per-record actions View, View Activity, Review.
- **Filters:** Country, Category, Status (Pending / In Review / Reviewed), Date range, keyword.
- **Table (all records, paginated):** ID, Title, Category, Country, Status chip, Reviewer, Last Updated, Actions.
- **Actions per record:**
  - **View:** opens a side drawer with full record details.
  - **View Activity:** opens a dialog with a timeline of audit entries (who, what, when).
  - **Review:** opens a dialog to mark Approved or Rejected with a comment. Updates the status and adds an audit entry.
- Hide **Review** for roles without the `record:review` permission.
- Top of page: 3 to 4 KPI cards (Total, Pending, In Review, Reviewed).

### 9.6 Document Upload (`/document-upload`)
Per the sitemap: manual upload page where all options are selected.
- **Form fields (all required):** Country, Document Type (Guidance, Regulation, Notification, Dossier, Other), Category, Industry, Business Area, Effective Date, Title, Description (optional), and a file picker.
- **File rules:** PDF, DOCX, XLSX only; max 10 MB. Show a drag-and-drop zone, file name and size, and a remove button.
- Validate with Zod and show clear inline errors.
- On submit, show a progress indicator, then a success toast and add the file to the "Recently uploaded" table below the form (mock store).
- Add a note under the dropzone: "Files are scanned before they are made available." (just a UI note for now).

### 9.7 Country Updates (`/country-updates`)
Per the sitemap: Manage (updates of each country with filters).
- **Filters:** Country, Update Type (New Regulation, Amendment, Guidance, Notification), Date range, keyword.
- **Layout:** left panel with a country list (with a count of recent updates), and the right side with the filtered updates feed (title, summary, date, type chip, link).
- **Manage:** for ADMIN, DEVELOPER and CLIENT, a "Manage" menu on each update (Mark as read, Add to watchlist). TEMP is read-only.

### 9.8 CMC Dashboard (`/cmc-dashboard`)
The sitemap gives no detail, so build a **placeholder dashboard**.
- 4 KPI cards, one line chart (submissions over time), one bar chart (by country), and a recent activity list, all with mock data.
- Show a small info note: "Layout is indicative. Final content to be confirmed."

### 9.9 Admin: User Management (`/admin/users`) (ADMIN only)
- Table: Name, Email, Role, Organisation, Status (Active / Disabled / Expired), Valid Until, Actions.
- **"Create User" dialog:** name, email, role (Admin, Developer, Client, Temp), organisation, and **Valid Until** (required and enabled only when role = Temp).
- Actions: Edit, Disable/Enable, Extend access (for Temp), Reset password (mock).

### 9.10 Admin: Audit Log (`/admin/audit`) (ADMIN, DEVELOPER)
- Table: Timestamp, User, Role, Action, Entity, IP (mock). Filters: user, action, date range. Read-only. Export CSV.

### 9.11 Utility pages
- `NotFoundPage` (404) and `ForbiddenPage` (403), each with a "Back to home" button.

---

## 10. Shared Components

| Component | Responsibility |
|---|---|
| `FilterBar` | Reusable row of filter controls with Apply and Reset |
| `DataTable` | Wrapper around MUI DataGrid with loading, empty and error states, pagination, and row selection |
| `ResultActions` | Download, Bookmark and Share icon buttons with tooltips |
| `CompareDialog` | Side-by-side comparison of 2 to 3 items |
| `StatusChip` | Colour-coded chip for statuses (Approved, Restricted, Banned, Pending, and so on) |
| `ConfirmDialog` | Generic confirm for destructive actions |
| `PageHeader` | Title, subtitle and optional action buttons |
| `Empty/Error/LoadingState` | Consistent feedback states used on every page |
| `Toast` | Global snackbar for success and error messages |
| `PrototypeBanner` | "Sample data only" notice |

---

## 11. Data Types (`src/types/index.ts`)

```ts
export type Role = 'ADMIN' | 'DEVELOPER' | 'CLIENT' | 'TEMP';

export interface User {
  id: string; name: string; email: string; role: Role;
  organisation?: string; validUntil?: string | null; enabled: boolean;
}

export interface Ingredient {
  id: string; name: string; synonyms: string[]; casNumber: string;
  type: 'Active API' | 'Excipient' | 'Preservative' | 'Colorant' | 'Flavour';
  country: string;
  status: 'Approved' | 'Restricted' | 'Banned' | 'Under Review';
  description?: string; lastUpdated: string;
}

export type RegulatoryCategory = 'GUIDANCE' | 'REGULATION' | 'NEWS' | 'ASSOCIATION';

export interface RegulatoryItem {
  id: string; title: string; category: RegulatoryCategory; country: string;
  industry: string; businessArea: string; source: string; summary: string;
  sourceUrl?: string; publishedDate: string;
  reviewStatus: 'PENDING' | 'IN_REVIEW' | 'REVIEWED';
  reviewer?: string; bookmarked?: boolean; lastUpdated: string;
}

export interface AuditEntry {
  id: string; timestamp: string; userEmail: string; role: Role;
  action: string; entityType: string; entityId?: string; ip?: string;
}

export interface UploadedDocument {
  id: string; title: string; fileName: string; fileSize: number;
  country: string; documentType: string; category: string;
  industry: string; businessArea: string; effectiveDate: string;
  uploadedBy: string; uploadedAt: string;
}

export interface CountryUpdate {
  id: string; country: string;
  type: 'New Regulation' | 'Amendment' | 'Guidance' | 'Notification';
  title: string; summary: string; date: string; read?: boolean;
}

export interface Project {
  id: string; name: string; owner: string; country: string;
  status: 'Planned' | 'Active' | 'On Hold' | 'Completed';
  progress: number; dueDate: string;
}

export interface Task {
  id: string; projectId: string; title: string; assignee: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'; dueDate: string;
}

export interface PagedResponse<T> {
  content: T[]; page: number; size: number; totalElements: number; totalPages: number;
}
```

---

## 12. API Contract (for the later Spring Boot backend)

Base URL: `${VITE_API_URL}` (for example `/api/v1`). All list endpoints are paginated with `page` and `size` query params and return `PagedResponse<T>`. Errors return `{ status, message, timestamp }`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Returns `{ token, user }` |
| POST | `/auth/logout` | Invalidate session |
| GET | `/ingredients?q=&type=&country=` | Search ingredients |
| GET | `/ingredients/compare?ids=` | Compare ingredients |
| POST | `/reports/ingredients` | Generate report data |
| GET | `/regulatory-items?category=&country=&industry=&businessArea=&q=` | Summarize and HUNT search |
| GET | `/regulatory-items/{id}` | Record details |
| POST | `/regulatory-items/{id}/bookmark` | Toggle bookmark |
| POST | `/regulatory-items/{id}/review` | Body: `{ decision, comment }` |
| GET | `/regulatory-items/{id}/activity` | Audit timeline for a record |
| GET | `/regulatory-items/{id}/download` | Download file |
| POST | `/documents` | Multipart upload with metadata |
| GET | `/documents` | List documents |
| GET | `/country-updates?country=&type=&from=&to=` | Country updates |
| PATCH | `/country-updates/{id}/read` | Mark as read |
| GET/POST | `/projects`, `/projects/{id}/tasks`, `/tasks` | Projects and tasks |
| GET/POST | `/watchlist` | Watchlist items |
| GET/POST | `/impact-assessments` | Assessments |
| GET/POST/PATCH | `/admin/users` | User management |
| GET | `/admin/audit` | Audit log |

Each `src/api/*.ts` function must map directly onto one of these endpoints so the swap to the real backend is simple.

---

## 13. Mock Data Requirements

- **Ingredients:** about 50 realistic entries (Paracetamol, Ibuprofen, Lactose Monohydrate, Magnesium Stearate, Microcrystalline Cellulose, Titanium Dioxide, Methylparaben, Povidone, and so on) across countries: **United States, European Union, India, United Kingdom, Japan, Canada, Australia, Brazil**.
- **Regulatory items:** about 80 entries covering all four categories, with realistic regulators (**FDA, EMA, CDSCO, MHRA, PMDA, Health Canada, TGA, ANVISA**) and dates within the last 18 months.
- **Country updates:** about 40 entries spread across the countries above.
- **Projects and tasks:** 8 projects and about 30 tasks.
- **Audit log:** about 60 entries.
- Mock services must **simulate latency (300 to 600 ms)** and support real filtering, sorting and pagination, not just return static arrays.
- Mutations (bookmark, review, upload, create) must update the in-memory store so the UI reacts during the demo. Data resets on page reload (that's acceptable for the prototype).

---

## 14. Build Order (follow in sequence, test after each step)

1. **Project setup:** Vite, dependencies, folder structure, theme, env files, ESLint/Prettier. *App runs.*
2. **Types, mock data and mock API layer** (`types`, `mocks`, `api`). *Console-test a few calls.*
3. **Auth:** `AuthContext`, login page, interceptors, `ProtectedRoute`, `RoleGuard`, idle timeout. *Log in as each role.*
4. **Layout:** sidebar, topbar, `PageHeader`, `PrototypeBanner`, role-based menu. *Each role sees the right menu.*
5. **Shared components:** `FilterBar`, `DataTable`, `StatusChip`, `ResultActions`, `CompareDialog`, state components, toast.
6. **Ingredient DB** (search, filters, compare, reports).
7. **HUNT** (filters, actions).
8. **Summarize Dashboard** (table, View, View Activity, Review).
9. **Document Upload.**
10. **Summarize** (reuse components from steps 5 to 8).
11. **Country Updates.**
12. **RI Operations** (Impact Assessment, Watchlist, Projects, Documents).
13. **CMC Dashboard** (placeholder).
14. **Admin pages** (User Management, Audit Log).
15. **Polish:** responsive check, empty and error states, 404/403 pages, README.
16. **Deploy to Vercel** (Section 16).

> If time runs short, cut in this order: Reports tab, Compare in Summarize, Impact Assessment, CMC details. **Never cut:** login and roles, layout and navigation, Ingredient DB, HUNT, Summarize Dashboard, deployment.

---

## 15. Quality and Security Requirements (Frontend)

**UX and quality**
- Every data view needs **loading, empty and error states**.
- Forms validate on submit and on blur, with clear messages.
- All icon-only buttons have tooltips and `aria-label`s. Support keyboard navigation and visible focus states. Aim for WCAG AA colour contrast.
- Responsive at 1440px, 1024px and mobile widths (tables scroll horizontally on small screens).
- No `console.log` or unused code in the final version. TypeScript `strict` mode on, and no `any` unless justified.
- Debounce search inputs. Use TanStack Query caching to avoid repeated calls.

**Security**
- Never use `dangerouslySetInnerHTML`. React escapes output by default, so keep it that way.
- Validate all user input with Zod, and validate the file type and size on upload (the backend must re-validate).
- Don't store sensitive data in `localStorage`. Use in-memory plus `sessionStorage` for the prototype token only.
- Don't log tokens or personal data.
- Use route guards **and** permission checks, but treat them as UX only. The backend is the real enforcement.
- Add security headers through `vercel.json` (Section 16).
- Keep dependencies updated and run `npm audit` before deploying.
- Never commit `.env` files with real values. Commit only `.env.example`.

---

## 16. Deployment (Vercel)

`vercel.json` (SPA routing plus security headers):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

**Steps**
1. Push `tool-frontend` to GitHub.
2. Import the repo in Vercel (framework preset: **Vite**, build `npm run build`, output `dist`).
3. Set environment variables: `VITE_USE_MOCK=true` for the first deploy, and later `VITE_USE_MOCK=false` and `VITE_API_URL=https://<backend-url>/api/v1` once the backend is live.
4. Test all four roles on the live URL, including the expired temp user.

---

## 17. `.github/copilot-instructions.md` (create this file first)

```markdown
# Project: Vistar regulatory tool, frontend prototype
- Stack: React 18, Vite, TypeScript (strict), MUI, React Router v6, TanStack Query, Axios, React Hook Form + Zod, Recharts
- Follow FRONTEND_SPEC.md in the project root as the source of truth
- All data access goes through src/api/*.ts. Each function returns mock data when VITE_USE_MOCK=true, otherwise calls the real API with the same signature
- Roles: ADMIN, DEVELOPER, CLIENT, TEMP. Use can(role, permission) for UI checks and RoleGuard for routes
- Use functional components and hooks only. Keep components small. No inline styles; use the MUI theme and sx prop
- Every data view has loading, empty and error states
- Never use dangerouslySetInnerHTML. Never store secrets in code
- Keep it simple. This is a 4-hour prototype
```

---

## 18. Suggested Copilot Prompts (use one per build step)

1. *"Following FRONTEND_SPEC.md sections 2 to 5, set up the Vite React TypeScript project with MUI theme, folder structure, env files, ESLint and Prettier."*
2. *"Create src/types/index.ts from section 11, then create the mock data files and the mock API layer from sections 12 and 13, with latency, filtering and pagination."*
3. *"Implement authentication from section 7: AuthContext, LoginPage, Axios interceptors, ProtectedRoute, RoleGuard, idle timeout, and the demo accounts."*
4. *"Build AppLayout, Sidebar, Topbar and PrototypeBanner from section 8, with menu items driven by config/menu.ts and the role matrix in section 6."*
5. *"Create the shared components in section 10."*
6. *"Build the Ingredient DB page from section 9.2 using the shared components."*
7. *(Repeat for 9.3 to 9.10, one page per prompt.)*
8. *"Review the project against sections 15 and 16, fix any issues, and write the README with setup and demo credentials."*

---

## 19. Definition of Done

- [ ] All four roles log in and see the correct menu, and the expired temp user is blocked
- [ ] Every sitemap item has a working or placeholder page
- [ ] Ingredient DB, HUNT, Summarize Dashboard and Document Upload work end to end on mock data
- [ ] Download, Bookmark, Share, View, View Activity and Review all behave as described
- [ ] Loading, empty and error states are present everywhere
- [ ] Responsive on desktop and mobile widths
- [ ] `npm run build` passes with no TypeScript or lint errors
- [ ] Deployed on Vercel and tested on a phone
- [ ] `README.md` lists setup steps, env variables and demo credentials
