# e-GRCP — Complete Project Learning Guide
> For trainees: Read this file first. It tells you *what* to open, *why* to open it, and *what to understand* at each step.
> Think of this as a guided walkthrough of the entire codebase — from zero to fully understanding every layer.

---

## TABLE OF CONTENTS

1. [Business Problem](#1-business-problem)
2. [Product Vision](#2-product-vision)
3. [User Journey](#3-user-journey)
4. [Component Design](#4-component-design)
5. [Redux Architecture](#5-redux-architecture)
6. [Router Architecture](#6-router-architecture)
7. [Axios Flow](#7-axios-flow)
8. [Error Handling](#8-error-handling)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment Strategy](#10-deployment-strategy)
11. [Coding Order — Build It From Scratch](#11-coding-order--build-it-from-scratch)
12. [File Reading Order — Start Here](#12-file-reading-order--start-here)

---

## 1. BUSINESS PROBLEM

### What problem does this app solve?

Large enterprises have four painful, disconnected processes:

| Problem | Pain |
|---|---|
| **Procurement** | Employees submit purchase requests via email or paper. No tracking, no approval trail. |
| **Vendor Management** | Vendor data is scattered across spreadsheets. Risk scores are guessed, not calculated. |
| **Risk & Compliance** | Risks are discovered late. Compliance gaps go unnoticed until audits. |
| **Audit** | Audit trails don't exist or are manually assembled right before an audit. |

### What e-GRCP does

**e-GRCP** (Enterprise Governance, Risk, Compliance & Procurement) is a single platform that unifies all four workflows:

- Employees create procurement requests → managers approve/reject them → everything is logged.
- Vendors are tracked with risk scores, compliance status, and contract info in one place.
- Risks are registered and monitored. Compliance frameworks are tracked against deadlines.
- Every action is automatically added to an immutable audit log.

### Files to read for this section
```
src/mocks/users.json          ← who are the users? what roles exist?
src/mocks/requests.json       ← what does a procurement request look like?
src/mocks/vendors.json        ← what does vendor data look like?
src/mocks/riskData.json       ← what does a risk entry look like?
```

### What to understand
- There are role-based users: `admin`, `manager`, `employee`, `auditor`
- A procurement request has: title, amount, status, priority, department, approval history
- A vendor has: name, category, risk score, compliance status, contract value
- A risk has: title, severity, likelihood, owner, mitigation status

---

## 2. PRODUCT VISION

### The goal in one sentence
Give every person in an enterprise a clean, role-aware interface to manage procurement, vendors, risk, compliance, and audits — all in one app, with full audit trails.

### Tech stack decision — why these choices?

| Technology | Why it was chosen |
|---|---|
| **React 19** | Component-based UI, great ecosystem |
| **Vite 6** | Fastest dev server and build tool for React |
| **MUI v6** | Production-grade component library, saves months of UI work |
| **Redux Toolkit** | Simplest way to manage complex shared state across 10+ features |
| **redux-persist** | User stays logged in across page refresh |
| **React Router v6** | Industry standard routing with nested route support |
| **Axios** | Promise-based HTTP client with interceptor support |
| **React Hook Form + Yup** | Performant forms with schema-based validation |
| **Recharts** | Composable charting library for dashboard KPIs |
| **Jest + Testing Library** | Standard testing stack for React apps |

### Files to read for this section
```
package.json                  ← full list of dependencies and scripts
vite.config.js                ← how Vite is configured (alias, port)
src/theme/index.js            ← brand colors, typography, component overrides
```

### What to understand
- `package.json` separates `dependencies` (runtime) from `devDependencies` (build/test only)
- `vite.config.js` sets `@` as an alias for `src/` — so `import x from '@/store'` = `import x from 'src/store'`
- The primary brand color is `#0057B8` (corporate blue). Light and dark themes are both fully defined.

---

## 3. USER JOURNEY

### Journey 1 — Employee submitting a procurement request

```
Browser loads → "/" → redirected to "/dashboard"
                    → not logged in → redirected to "/login"
                    
Login page → enters email/password → Redux dispatches loginUser thunk
           → authService.loginUser() called → finds user in users.json
           → token generated → stored in Redux + localStorage (persist)
           → redirected to "/dashboard"

Dashboard  → sees KPIs: total requests, pending approvals, vendor count, risk count
           → clicks "Procurement" in sidebar

Procurement List → sees all requests with filters (status, dept, priority)
                 → clicks "New Request" button

Create Request → fills form: title, description, amount, department, priority
              → react-hook-form + Yup validates fields
              → submits → dispatches createRequest thunk
              → new request appears at top of list
              → success toast appears

Request Detail → manager navigates to a specific request
               → sees full details + approval history timeline
               → clicks "Approve" or "Reject" → enters a comment
               → dispatches approveRequest/rejectRequest thunk
               → status updates immediately in Redux store
```

### Journey 2 — Session expiry

```
User is active → token expires on backend → next API call returns 401
Response interceptor in apiClient.js → dispatches setSessionExpired(true)
ProtectedRoute sees sessionExpired=true → redirects to "/session-expired"
User clicks "Login Again" → cleared auth state → back to "/login"
```

### Key files for this section
```
src/pages/auth/LoginPage.jsx
src/pages/dashboard/DashboardPage.jsx
src/pages/procurement/ProcurementListPage.jsx
src/pages/procurement/CreateRequestPage.jsx
src/pages/procurement/ProcurementDetailPage.jsx
src/pages/auth/SessionExpiredPage.jsx
```

---

## 4. COMPONENT DESIGN

### Component hierarchy (top to bottom)

```
main.jsx
└── <Provider store={store}>                 ← Redux store available everywhere
    └── <PersistGate>                        ← waits for localStorage to rehydrate
        └── <App>
            └── <ThemeProvider theme={...}> ← MUI light/dark theme
                └── <ErrorBoundary>         ← catches render crashes
                    └── <BrowserRouter>
                        └── <Suspense fallback={<PageLoader />}>
                            ├── Public Routes (Login, etc.)
                            └── <ProtectedRoute>
                                └── <AppLayout>
                                    ├── <AppHeader />    ← fixed top bar
                                    ├── <AppSidebar />   ← fixed left drawer
                                    └── <Outlet />       ← current page renders here
```

### Layout components
```
src/components/layout/AppLayout.jsx    ← shell: positions header + sidebar + main
src/components/layout/AppHeader.jsx    ← search, theme toggle, notifications, user menu
src/components/layout/AppSidebar.jsx   ← collapsible nav drawer with 10 links
```

**AppLayout** — reads `sidebarOpen` and `sidebarCollapsed` from Redux `ui` slice to calculate the `margin-left` of the main content area. Uses CSS `transition` so sidebar collapse is animated.

**AppHeader** — dispatches `toggleTheme`, `toggleSidebar`, `setSidebarCollapsed`, and `logoutUser` actions directly. Shows notification badge using `unreadCount` from Redux.

**AppSidebar** — the `navItems` array is the single source of truth for all navigation links. `useLocation` drives the active highlight. The drawer renders as `variant="persistent"` — it stays mounted, not destroyed on close.

### Common/reusable components
```
src/components/common/
├── ErrorBoundary.jsx     ← class component, catches JS errors in render tree
├── GlobalSnackbar.jsx    ← MUI Snackbar reading from ui.snackbar Redux state
├── KpiCard.jsx           ← card with icon, value, label, trend arrow
├── PageLoader.jsx        ← centered spinner for Suspense fallback
├── ProtectedRoute.jsx    ← route guard checking auth + session state
├── SectionHeader.jsx     ← consistent page-level title + subtitle + action slot
└── StatusChip.jsx        ← colored MUI Chip for statuses (Approved, Rejected, etc.)
```

### Design patterns used
| Pattern | Where | Why |
|---|---|---|
| `React.memo` | AppHeader, AppSidebar | Prevent re-render when parent re-renders |
| `useMemo` | AppSidebar drawer content | Expensive JSX tree only re-computed when deps change |
| `useCallback` | AppHeader logout handler | Stable function reference passed as event handler |
| `React.lazy` + `Suspense` | App.jsx page imports | Code-split every page into its own JS chunk |
| Compound components | AppLayout → Outlet | Parent renders shell, React Router injects child page |

---

## 5. REDUX ARCHITECTURE

### Store setup
```
src/store/index.js        ← configureStore, combineReducers, persist config
src/store/slices/         ← one file per domain slice
```

### The full store shape
```js
{
  auth: {           // persisted: user, token, isAuthenticated
    user, token, isAuthenticated, loading, error, sessionExpired
  },
  ui: {             // persisted: themeMode, sidebarOpen
    themeMode, sidebarOpen, sidebarCollapsed, globalLoading, snackbar
  },
  procurement: {
    requests[], selectedRequest, total, page, pageSize,
    filters { status, search, department, priority },
    loading, detailLoading, error, successMessage
  },
  vendor: {
    vendors[], selectedVendor, kpis, total, page, filters,
    loading, detailLoading, error
  },
  dashboard: {
    kpis, spendByCategory[], requestsByMonth[], riskByLevel[],
    complianceStatus[], topVendors[], loading
  },
  notification: {
    notifications[], unreadCount, loading
  },
  risk: { ... },
  compliance: { ... },
  audit: { ... },
  report: { ... }
}
```

### Persistence strategy
Only sensitive and UI preferences are persisted to `localStorage`:
- **auth slice**: `whitelist: ['user', 'token', 'isAuthenticated']` — so user stays logged in
- **ui slice**: `whitelist: ['themeMode', 'sidebarOpen']` — so theme preference is remembered
- All other slices: NOT persisted — data is re-fetched fresh on every app load

### How a Redux async flow works (use procurementSlice as the example)

```
Component mounts
  → dispatches fetchRequests(params)
       ↓
createAsyncThunk fires
  → state.loading = true  (pending case)
  → calls procurementService.fetchRequests(params)
       ↓
  [success] → state.loading = false, state.requests = payload  (fulfilled case)
  [failure] → state.loading = false, state.error = errorMsg   (rejected case)
       ↓
Component re-renders from Redux state change
  → shows data or error message
```

### Slice files to read in order
```
src/store/slices/uiSlice.js             ← simplest slice, no async, just UI state
src/store/slices/authSlice.js           ← async login/logout + session expiry
src/store/slices/procurementSlice.js    ← full CRUD + approve/reject async thunks
src/store/slices/notificationSlice.js   ← unread count management
src/store/index.js                      ← how all slices are assembled + persisted
```

### Key concept: rejectWithValue
Every `createAsyncThunk` wraps the service call in `try/catch` and calls `rejectWithValue(error.message)`. This ensures the `rejected` case receives a plain string (serializable), not a full Error object (which Redux Toolkit would warn about).

---

## 6. ROUTER ARCHITECTURE

### File to read
```
src/App.jsx    ← the entire route tree is here
```

### Route structure explained

```
/login                    → LoginPage              (public)
/forgot-password          → ForgotPasswordPage     (public)
/reset-password           → ResetPasswordPage      (public)
/session-expired          → SessionExpiredPage      (public)

<ProtectedRoute>          ← guard: checks auth + session expiry
  <AppLayout>             ← shell: header + sidebar + main area
    /dashboard            → DashboardPage
    /procurement          → ProcurementListPage
    /procurement/new      → CreateRequestPage
    /procurement/:id      → ProcurementDetailPage
    /vendors              → VendorListPage
    /vendors/:id          → VendorDetailPage
    /risk                 → RiskCenterPage
    /compliance           → ComplianceCenterPage
    /audit                → AuditCenterPage
    /approval             → ApprovalWorkbenchPage
    /notifications        → NotificationCenterPage
    /reports              → ReportingCenterPage
    /settings             → SettingsPage

/                         → <Navigate to="/dashboard" />
*                         → NotFoundPage
```

### ProtectedRoute logic (read this file carefully)
```
src/components/common/ProtectedRoute.jsx
```

Three checks happen in order:
1. **sessionExpired** → redirect to `/session-expired`
2. **!isAuthenticated** → redirect to `/login` (passes `location` as state so user can be sent back after login)
3. **allowedRoles mismatch** → redirect to `/dashboard` (role-based access, optional prop)

### Code splitting with lazy loading
Every page import in `App.jsx` uses `React.lazy()`:
```js
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
```
This means each page is a separate JS bundle. The browser only downloads `DashboardPage.js` when the user first visits `/dashboard`. The `<Suspense fallback={<PageLoader />}>` wrapping shows a spinner during that download.

---

## 7. AXIOS FLOW

### File to read
```
src/services/apiClient.js    ← the Axios instance with interceptors
```

### How it's set up

```js
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})
```

- `VITE_API_BASE_URL` is an environment variable. In dev, there's no `.env` file so it falls back to `/api`. In production, you'd set `VITE_API_BASE_URL=https://api.yourcompany.com`.
- 15-second timeout prevents hanging requests.

### Request interceptor — token injection

```
Every outgoing request
  → interceptor reads store.getState().auth.token
  → if token exists → adds Authorization: Bearer <token> header
  → if no token → request goes through without auth header (public endpoints)
```

### Response interceptor — global error handling

```
200-299 → returns response.data (strips the axios wrapper)

401     → dispatches setSessionExpired(true) to Redux
           → ProtectedRoute detects this → redirects to /session-expired
           
403     → throws Error('You do not have permission...')
404     → throws Error('The requested resource was not found.')
5xx     → throws Error('A server error occurred. Please try again later.')
No response (network down) → throws Error('Network error. Please check your connection.')
```

### Current state: mock services
Right now, **none of the service files actually call `apiClient`**. They use local JSON mock data with `setTimeout` delays to simulate a real API. When the backend is ready, you replace:

```js
// CURRENT (mock)
const delay = ms => new Promise(r => setTimeout(r, ms))
export const fetchRequests = async (params) => {
  await delay(600)
  return { requests: mockData, total: mockData.length }
}

// FUTURE (real API)
export const fetchRequests = async (params) => {
  return apiClient.get('/procurement/requests', { params })
}
```

The Axios client (`apiClient.js`) is completely wired and ready. Just swap the service implementations.

### All service files
```
src/services/apiClient.js         ← Axios instance (the core)
src/services/authService.js       ← login, logout, forgot/reset password
src/services/dashboardService.js  ← KPI and chart data
src/services/procurementService.js← CRUD + approve/reject
src/services/vendorService.js     ← vendor list + detail + KPIs
src/services/riskService.js       ← risk items
src/services/complianceService.js ← compliance frameworks
src/services/auditService.js      ← audit log entries
src/services/notificationService.js← notifications + mark read
src/services/reportService.js     ← report data
```

---

## 8. ERROR HANDLING

### Three layers of error handling

#### Layer 1 — Network/HTTP errors (Axios interceptor)
**File:** `src/services/apiClient.js`

Catches all HTTP errors centrally. The component never needs to know if the error was a 404, 403, or network drop — it just receives a human-readable `error.message`.

Special case: `401` doesn't throw — it dispatches to Redux, which triggers a route redirect.

#### Layer 2 — Async operation errors (Redux slices)
**Example file:** `src/store/slices/procurementSlice.js`

Every `createAsyncThunk` does:
```js
try {
  return await service.doSomething()
} catch (e) {
  return rejectWithValue(e.message)  // sends error string to rejected case
}
```
The slice stores `state.error = action.payload` on rejection. The component reads `procurement.error` from Redux and renders it.

#### Layer 3 — Render crashes (ErrorBoundary)
**File:** `src/components/common/ErrorBoundary.jsx`

This is a **class component** (required for error boundaries — hooks can't catch render errors). It wraps the entire app in `App.jsx`. If any component throws during render, the boundary catches it and shows a fallback UI instead of a blank screen.

```jsx
// In App.jsx
<ErrorBoundary>
  <BrowserRouter>
    ...all routes...
  </BrowserRouter>
</ErrorBoundary>
```

#### Layer 4 — Form validation errors (React Hook Form + Yup)
**Example file:** `src/pages/procurement/CreateRequestPage.jsx`

Field-level validation runs before any dispatch. The user sees inline error messages under each field. The form never calls `dispatch` if validation fails.

```
User submits form
  → Yup schema validates all fields
  → [invalid] → shows error messages under fields, stops here
  → [valid] → dispatches createRequest thunk
```

#### Layer 5 — User feedback (GlobalSnackbar)
**File:** `src/components/common/GlobalSnackbar.jsx`

Sits at the root of the app. Reads `ui.snackbar` from Redux. Any part of the app can trigger a toast:
```js
dispatch(showSnackbar({ message: 'Request approved', severity: 'success' }))
dispatch(showSnackbar({ message: 'Something went wrong', severity: 'error' }))
```

---

## 9. TESTING STRATEGY

### Setup files
```
jest.config.cjs       ← Jest configuration
babel.config.cjs      ← Babel config so Jest can parse JSX/ES modules
src/setupTests.js     ← imports @testing-library/jest-dom matchers
```

### Test files (all in `src/__tests__/`)

| File | What it tests |
|---|---|
| `authSlice.test.js` | Redux auth slice: login/logout state transitions, error states |
| `uiSlice.test.js` | Redux ui slice: theme toggle, sidebar toggle, snackbar |
| `notificationSlice.test.js` | Notification state: mark read, mark all read, unread count |
| `authService.test.js` | Login with correct/wrong credentials, forgot password |
| `procurementService.test.js` | Fetch requests, create, approve, reject |
| `vendorService.test.js` | Fetch vendors, fetch single vendor, KPIs |
| `KpiCard.test.jsx` | Component renders title, value, icon correctly |
| `StatusChip.test.jsx` | Chip renders correct color for each status string |

### Three types of tests in this project

**1. Slice tests (reducer unit tests)**
```js
// Test a reducer directly — no React, no DOM
const initialState = { themeMode: 'light', ... }
const result = uiReducer(initialState, toggleTheme())
expect(result.themeMode).toBe('dark')
```
Fast, pure, no side effects.

**2. Service tests (async unit tests)**
```js
// Test that services return correct data shapes
const result = await procurementService.fetchRequests({})
expect(result).toHaveProperty('requests')
expect(Array.isArray(result.requests)).toBe(true)
```
Uses Jest's async/await support. No network calls (mock data).

**3. Component tests (integration tests)**
```js
// Render a component, interact with it, assert what the user sees
render(<KpiCard title="Total Requests" value={42} />)
expect(screen.getByText('Total Requests')).toBeInTheDocument()
expect(screen.getByText('42')).toBeInTheDocument()
```
Uses React Testing Library — tests from the user's perspective.

### Running tests
```bash
npm test              # run all tests once + show coverage report
npm run test:watch    # re-run on file save (dev mode)
```

Coverage threshold: **80% line coverage** enforced. Build will fail if coverage drops below this.

---

## 10. DEPLOYMENT STRATEGY

### Build command
```bash
npm run build
```
This runs `vite build` and produces optimized output in the `dist/` folder:
- All React code is compiled and minified
- CSS is extracted and minified
- Each lazy-loaded page becomes a separate JS chunk (code splitting)
- Assets (images, fonts) are hashed for cache busting

### Preview the production build locally
```bash
npm run preview
```
Starts a local server serving the `dist/` folder exactly as a production server would.

### Environment variables
Vite uses `.env` files. Variables must be prefixed with `VITE_` to be available in browser code.

```
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api

# .env.production
VITE_API_BASE_URL=https://api.yourcompany.com
```

### What the `dist/` folder contains (after build)
```
dist/
├── index.html                  ← single HTML entry point
├── assets/
│   ├── index-[hash].js         ← main app bundle
│   ├── DashboardPage-[hash].js ← lazy-loaded page chunk
│   ├── LoginPage-[hash].js     ← lazy-loaded page chunk
│   ├── ... (one chunk per page)
│   └── index-[hash].css        ← all styles
```

### Deployment options

| Option | How |
|---|---|
| **Nginx / Apache** | Copy `dist/` to web root. Add rewrite rule: all paths → `index.html` (SPA routing) |
| **Vercel** | `npm run build` runs automatically. Set `VITE_API_BASE_URL` in dashboard. |
| **Netlify** | Connect repo. Set build command to `npm run build`, publish dir to `dist`. Add `_redirects` file: `/* /index.html 200` |
| **Docker** | Nginx base image, `COPY dist/ /usr/share/nginx/html/` |

### Critical: SPA routing requirement
This is a Single Page Application. The server must redirect ALL routes to `index.html`. Without this, a direct visit to `https://yourapp.com/procurement` returns a 404 from the server.

Nginx example:
```nginx
location / {
  try_files $uri /index.html;
}
```

---

## 11. CODING ORDER — BUILD IT FROM SCRATCH

> Reading order = top-down (understand the big picture first).
> Coding order = bottom-up (build what has zero dependencies first, pages last).
> You cannot code a component that imports something that doesn't exist yet.

---

### Why the orders differ

| Reading order logic | Coding order logic |
|---|---|
| Start with what the app *does* (data, routes) | Start with what has *zero dependencies* (config, JSON, theme) |
| Understand the big picture first | Build the foundation before the walls |
| Top-down: entry point → pages | Bottom-up: data → store → services → components → pages |
| OK to reference files not read yet | You can only use code that already exists |

The one thing that is **the same** in both orders: mock data comes first, pages come last.

---

### Step 1 — Project scaffold (zero dependencies)
```
npm create vite@latest egrcp -- --template react
cd egrcp
npm install   ← install everything from package.json
```
Then create these config files immediately — nothing works without them:
```
vite.config.js          ← add @ alias for src/, set port 3000
babel.config.cjs        ← so Jest can parse JSX and ES modules
jest.config.cjs         ← jsdom environment, coverage threshold, module mapper
src/setupTests.js       ← import @testing-library/jest-dom
src/index.css           ← global CSS resets
```
At this point: `npm run dev` starts a blank Vite app. `npm test` runs with no tests.

---

### Step 2 — Mock data (everything downstream depends on these shapes)
```
src/mocks/users.json            ← define user roles: admin, manager, employee, auditor
src/mocks/requests.json         ← procurement request shape: id, title, amount, status, dept
src/mocks/vendors.json          ← vendor shape: name, category, riskScore, contractValue
src/mocks/riskData.json         ← risk shape: title, severity, likelihood, mitigation
src/mocks/notifications.json    ← notification shape: id, message, read, createdAt
src/mocks/reports.json          ← report/chart data shape
```
Write these as JSON schemas first. They are your in-memory database. Every service file will import from here.

---

### Step 3 — Theme (zero dependencies on your own code)
```
src/theme/index.js    ← lightTheme and darkTheme using MUI createTheme()
```
Do this before writing any component. Every component you write after this will look correct from day one. Primary color: `#0057B8`.

---

### Step 4 — Redux slices (build simplest first, no UI dependencies)

Build in this order — each one teaches a new concept:

```
src/store/slices/uiSlice.js            ← START HERE: no async, just toggles
                                          (themeMode, sidebarOpen, snackbar)

src/store/slices/authSlice.js          ← first async thunk: login + logout
                                          introduces createAsyncThunk pattern

src/store/slices/notificationSlice.js  ← unreadCount + markAsRead pattern

src/store/slices/dashboardSlice.js     ← KPIs + chart data, read-only

src/store/slices/procurementSlice.js   ← full CRUD: fetch list, fetch by id,
                                          create, approve, reject + filters/pagination

src/store/slices/vendorSlice.js        ← same CRUD pattern as procurement

src/store/slices/riskSlice.js
src/store/slices/complianceSlice.js
src/store/slices/auditSlice.js
src/store/slices/reportSlice.js

src/store/index.js                     ← LAST: combineReducers + persist config
                                          (auth and ui are persisted, others are not)
```

**Write slice tests as you write each slice — they are pure and instantly testable:**
```
src/__tests__/uiSlice.test.js           ← test toggleTheme, toggleSidebar, showSnackbar
src/__tests__/authSlice.test.js         ← test login fulfilled/rejected, sessionExpired
src/__tests__/notificationSlice.test.js ← test markAsRead, unreadCount decrement
```

---

### Step 5 — Service layer (depends on mock data + apiClient)

```
src/services/apiClient.js          ← WRITE FIRST: Axios instance + interceptors
                                      request interceptor: inject Bearer token from Redux
                                      response interceptor: handle 401/403/404/5xx

src/services/authService.js        ← reads users.json, simulates login/logout delay
src/services/procurementService.js ← reads requests.json, simulates CRUD with delay
src/services/vendorService.js      ← reads vendors.json
src/services/riskService.js        ← reads riskData.json
src/services/complianceService.js
src/services/auditService.js
src/services/notificationService.js ← reads notifications.json, markAsRead logic
src/services/dashboardService.js    ← assembles KPI numbers from mock data
src/services/reportService.js       ← reads reports.json
```

**Write service tests as you go:**
```
src/__tests__/authService.test.js          ← correct login, wrong password, forgot password
src/__tests__/procurementService.test.js   ← fetchRequests, createRequest, approveRequest
src/__tests__/vendorService.test.js        ← fetchVendors, fetchVendorById, fetchVendorKpis
```

---

### Step 6 — Reusable common components (no page dependencies)

Build the smallest, most independent components first:

```
src/components/common/PageLoader.jsx      ← centered MUI CircularProgress, no Redux
src/components/common/StatusChip.jsx      ← MUI Chip with color by status string, no Redux
src/components/common/KpiCard.jsx         ← MUI Card: icon + value + label + trend, no Redux
src/components/common/SectionHeader.jsx   ← title + subtitle + optional action button slot
src/components/common/GlobalSnackbar.jsx  ← reads ui.snackbar from Redux, MUI Snackbar
src/components/common/ErrorBoundary.jsx   ← class component (must be class, not function)
src/components/common/ProtectedRoute.jsx  ← reads auth.isAuthenticated + auth.sessionExpired
```

**Write component tests:**
```
src/__tests__/StatusChip.test.jsx   ← renders correct label and color per status
src/__tests__/KpiCard.test.jsx      ← renders title, value, icon correctly
```

---

### Step 7 — Layout components (depend on common components + Redux ui/auth slices)

```
src/components/layout/AppHeader.jsx    ← search bar, theme toggle, notification badge,
                                          user avatar menu, logout dispatch

src/components/layout/AppSidebar.jsx   ← MUI Drawer (persistent), 10 nav items,
                                          active highlight via useLocation,
                                          collapse/expand via sidebarCollapsed Redux state

src/components/layout/AppLayout.jsx    ← positions Header + Sidebar + main content area
                                          uses margin-left transition for sidebar animation
                                          renders <Outlet /> for child pages
```

At this point you have a fully functional app shell with no page content yet.

---

### Step 8 — App entry point and routing (depends on everything above)

```
src/App.jsx     ← WRITE THIS SECOND TO LAST:
                   ThemeProvider (reads ui.themeMode)
                   ErrorBoundary
                   BrowserRouter
                   Suspense with PageLoader fallback
                   All routes: public + protected nested under ProtectedRoute > AppLayout
                   React.lazy() import for every page

src/main.jsx    ← WRITE THIS LAST:
                   ReactDOM.createRoot
                   <Provider store={store}>
                   <PersistGate loading={null} persistor={persistor}>
                   <App />
```

At this point `npm run dev` gives you a working app with navigation but empty page placeholders.

---

### Step 9 — Pages (build in dependency order — auth first, complex CRUD last)

**Auth pages first** — they have no layout wrapper, no sidebar, simplest structure:
```
src/pages/auth/LoginPage.jsx           ← react-hook-form + Yup + dispatch(loginUser)
src/pages/auth/ForgotPasswordPage.jsx  ← single email field + dispatch
src/pages/auth/ResetPasswordPage.jsx   ← password + confirm fields
src/pages/auth/SessionExpiredPage.jsx  ← static message + "Login Again" button
```

**Simple read-only display pages** — just fetch data and render it:
```
src/pages/dashboard/DashboardPage.jsx         ← KpiCards + Recharts (4 chart types)
src/pages/notifications/NotificationCenterPage.jsx
src/pages/risk/RiskCenterPage.jsx
src/pages/compliance/ComplianceCenterPage.jsx
src/pages/audit/AuditCenterPage.jsx
src/pages/reports/ReportingCenterPage.jsx
src/pages/settings/SettingsPage.jsx
```

**List + detail pairs** — navigation between two related pages:
```
src/pages/vendors/VendorListPage.jsx    ← MUI DataGrid + filters + navigate to detail
src/pages/vendors/VendorDetailPage.jsx  ← useParams to get :id, fetch single vendor
```

**Most complex — full CRUD + approval workflow:**
```
src/pages/procurement/ProcurementListPage.jsx   ← table + filters (status/dept/priority/search)
                                                    + pagination + navigate to detail or new

src/pages/procurement/CreateRequestPage.jsx     ← react-hook-form + Yup schema validation
                                                    + dispatch(createRequest) on submit

src/pages/procurement/ProcurementDetailPage.jsx ← full request details + timeline
                                                    + approve/reject with comment dialog
                                                    + dispatch(approveRequest/rejectRequest)
```

**Approval workbench** — depends on procurement being fully done:
```
src/pages/approval/ApprovalWorkbenchPage.jsx   ← pending requests queue for managers
```

**404 — last, trivially simple:**
```
src/pages/NotFoundPage.jsx    ← static message + "Go Home" button
```

---

### Full coding sequence at a glance

```
[1]  Vite scaffold + config files
[2]  src/mocks/*.json                        ← data shapes
[3]  src/theme/index.js                      ← brand colors
[4]  src/store/slices/uiSlice.js             ← simplest Redux slice
[4]  src/store/slices/authSlice.js
[4]  src/store/slices/notificationSlice.js
[4]  src/store/slices/dashboardSlice.js
[4]  src/store/slices/procurementSlice.js    ← full CRUD pattern
[4]  src/store/slices/vendorSlice.js
[4]  src/store/slices/risk/compliance/audit/reportSlice.js
[4]  src/store/index.js                      ← assemble + persist
     ↓ write slice tests as you go
[5]  src/services/apiClient.js               ← Axios + interceptors
[5]  src/services/*Service.js                ← all 9 service files
     ↓ write service tests as you go
[6]  src/components/common/PageLoader.jsx
[6]  src/components/common/StatusChip.jsx
[6]  src/components/common/KpiCard.jsx
[6]  src/components/common/SectionHeader.jsx
[6]  src/components/common/GlobalSnackbar.jsx
[6]  src/components/common/ErrorBoundary.jsx
[6]  src/components/common/ProtectedRoute.jsx
     ↓ write component tests as you go
[7]  src/components/layout/AppHeader.jsx
[7]  src/components/layout/AppSidebar.jsx
[7]  src/components/layout/AppLayout.jsx
[8]  src/App.jsx                             ← all routes wired up
[8]  src/main.jsx                            ← app entry point
[9]  src/pages/auth/*.jsx                    ← auth pages
[9]  src/pages/dashboard/DashboardPage.jsx
[9]  src/pages/notifications, risk, compliance, audit, reports, settings
[9]  src/pages/vendors/VendorListPage + VendorDetailPage
[9]  src/pages/procurement/ProcurementListPage
[9]  src/pages/procurement/CreateRequestPage  ← most complex form
[9]  src/pages/procurement/ProcurementDetailPage ← approve/reject
[9]  src/pages/approval/ApprovalWorkbenchPage
[9]  src/pages/NotFoundPage.jsx
```

*Total estimated coding time: 3–5 days for an experienced developer, 2–3 weeks for a trainee building it carefully with tests.*

---

## 12. FILE READING ORDER — START HERE

Follow this exact sequence. Each step builds on the previous one.

### Phase 1 — Understand the data (30 mins)
```
1.  src/mocks/users.json              → who are the users, what roles
2.  src/mocks/requests.json           → what a procurement request looks like
3.  src/mocks/vendors.json            → what vendor data looks like
4.  src/mocks/riskData.json           → what a risk entry looks like
5.  src/mocks/notifications.json      → notification data structure
```

### Phase 2 — Understand the entry point (20 mins)
```
6.  package.json                      → all dependencies, run scripts
7.  vite.config.js                    → build tool configuration
8.  src/main.jsx                      → app entry: Provider, PersistGate
9.  src/index.css                     → global CSS resets
```

### Phase 3 — Understand routing and shell (30 mins)
```
10. src/App.jsx                       → ALL routes, theme, Suspense, ErrorBoundary
11. src/components/common/ProtectedRoute.jsx  → how auth guard works
12. src/components/layout/AppLayout.jsx       → page shell structure
13. src/components/layout/AppHeader.jsx       → top navigation bar
14. src/components/layout/AppSidebar.jsx      → side navigation drawer
```

### Phase 4 — Understand the Redux store (45 mins)
```
15. src/store/slices/uiSlice.js        → start here: simplest slice
16. src/store/slices/authSlice.js      → login/logout + session expiry
17. src/store/slices/procurementSlice.js → full async CRUD example
18. src/store/slices/notificationSlice.js → unread count pattern
19. src/store/index.js                 → how slices combine + persist config
```

### Phase 5 — Understand the service layer (30 mins)
```
20. src/services/apiClient.js         → Axios instance + interceptors
21. src/services/authService.js       → mock auth implementation
22. src/services/procurementService.js → mock CRUD implementation
```
**Key insight:** Services are currently mock. `apiClient.js` shows how real API calls would work.

### Phase 6 — Understand reusable components (30 mins)
```
23. src/components/common/ErrorBoundary.jsx   → class component, render safety
24. src/components/common/GlobalSnackbar.jsx  → toast system
25. src/components/common/StatusChip.jsx      → reusable status display
26. src/components/common/KpiCard.jsx         → dashboard metric card
27. src/theme/index.js                        → MUI theme: colors, typography
```

### Phase 7 — Understand key pages (45 mins)
```
28. src/pages/auth/LoginPage.jsx             → form, validation, dispatch
29. src/pages/dashboard/DashboardPage.jsx    → KPIs, charts, data fetching
30. src/pages/procurement/ProcurementListPage.jsx  → table, filters, pagination
31. src/pages/procurement/CreateRequestPage.jsx    → form with react-hook-form
32. src/pages/procurement/ProcurementDetailPage.jsx → approve/reject flow
```

### Phase 8 — Understand testing (30 mins)
```
33. jest.config.cjs                          → test configuration
34. babel.config.cjs                         → JSX transform for tests
35. src/setupTests.js                        → jest-dom matchers
36. src/__tests__/uiSlice.test.js            → simplest test to start with
37. src/__tests__/authSlice.test.js          → async thunk testing
38. src/__tests__/KpiCard.test.jsx           → component test with RTL
39. src/__tests__/procurementService.test.js → async service test
```

---

## QUICK REFERENCE — Key Concepts

### How does a page load data?
```
Page mounts (useEffect)
  → dispatch(fetchRequests())         ← async thunk
  → service function called           ← returns mock/real data
  → Redux state updated              ← loading → data
  → useSelector triggers re-render   ← component shows data
```

### How does a form submit work?
```
User fills form
  → react-hook-form tracks values
  → user clicks submit
  → Yup validates via handleSubmit(onSubmit)
  → [invalid] error messages shown, stops here
  → [valid] dispatch(createRequest(formData))
  → async thunk → service → Redux state updated
  → success toast via dispatch(showSnackbar(...))
```

### How does the sidebar know which item is active?
```
useLocation() returns current pathname
navItems.find(item => location.pathname.startsWith(item.path))
→ matching item gets selected=true → MUI highlights it blue
```

### How does dark mode work?
```
AppHeader has a theme toggle button
  → dispatch(toggleTheme())
  → ui.themeMode flips: 'light' ↔ 'dark'
  → redux-persist saves to localStorage
  → App.jsx: themeMode === 'dark' ? darkTheme : lightTheme
  → ThemeProvider re-renders entire app with new theme
```

### How does session expiry work?
```
Any API call returns 401
  → Axios response interceptor catches it
  → dispatch(setSessionExpired(true))
  → auth.sessionExpired = true in Redux
  → ProtectedRoute checks sessionExpired first
  → redirects to /session-expired
  → user clicks "Login Again"
  → clearAuth() resets state → redirected to /login
```

---

*Total estimated reading time: ~4 hours for a thorough walkthrough.*
*After completing phases 1-8, you will be able to explain all 10 topics listed at the top of this document.*
