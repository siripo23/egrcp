# e-GRCP — Enterprise Governance, Risk, Compliance & Procurement Platform

A production-grade enterprise SaaS frontend application built with React 19, Vite, Redux Toolkit, MUI, and Recharts.

## 🚀 Quick Start

```bash
npm install --legacy-peer-deps
npm run dev        # http://localhost:3000
npm test           # Run all tests
npm run build      # Production build
```

## 🔑 Demo Credentials

| Role       | Email                          | Password       |
|------------|-------------------------------|----------------|
| Admin      | alice.johnson@company.com      | Admin@123      |
| Manager    | bob.smith@company.com          | Manager@123    |
| Employee   | carol.white@company.com        | Employee@123   |
| Auditor    | david.brown@company.com        | Auditor@123    |
| Compliance | emma.davis@company.com         | Compliance@123 |

## 📁 Project Structure

```
src/
├── __mocks__/          # Jest file mocks
├── __tests__/          # Test suites (50 tests, 8 suites)
├── components/
│   ├── common/         # KpiCard, StatusChip, ErrorBoundary, etc.
│   └── layout/         # AppHeader, AppSidebar, AppLayout
├── mocks/              # Mock JSON data (users, vendors, requests, risks, etc.)
├── pages/
│   ├── auth/           # Login, ForgotPassword, ResetPassword, SessionExpired
│   ├── dashboard/      # Executive Dashboard with KPIs and charts
│   ├── procurement/    # List, Detail, Create Request pages
│   ├── vendors/        # Vendor List and Detail pages
│   ├── risk/           # Risk Center with heat matrix
│   ├── compliance/     # Compliance Center
│   ├── audit/          # Audit Center
│   ├── approval/       # Approval Workbench
│   ├── notifications/  # Notification Center
│   ├── reports/        # Reporting Center with CSV export
│   └── settings/       # User Settings
├── services/           # Mock API services (simulated async calls)
├── store/
│   ├── index.js        # configureStore with redux-persist
│   └── slices/         # 10 Redux Toolkit slices
└── theme/              # MUI light/dark themes
```

## 🧩 Modules

| Module | Description |
|--------|-------------|
| Authentication | Login, Forgot Password, Reset Password, Session Expired |
| Executive Dashboard | KPI cards, procurement trends, risk trends, activity timeline |
| Procurement Workspace | Request list with filters, detail view with tabs, create form |
| Vendor Governance | Vendor grid/cards, profiles with documents & history |
| Risk Center | Risk register, heat matrix, distribution pie chart |
| Compliance Center | Violations, missing documents, expired certifications |
| Audit Center | Audit history, user activities, system logs |
| Approval Workbench | Queued approvals with approve/reject dialogs |
| Notification Center | Priority notifications with read/unread state |
| Reporting Center | Charts, tables, CSV export, saved reports |
| User Settings | Profile, theme, preferences, security/2FA |

## 🏗 Architecture

- **State Management**: Redux Toolkit with 10 slices, redux-persist for auth + UI
- **Routing**: React Router v6 with protected routes, role-based access, lazy loading
- **API Layer**: Mock services simulating async API calls with delays
- **Theming**: MUI v6 with full light/dark mode support
- **Performance**: React.memo, useMemo, useCallback, lazy imports on all routes
- **Error Handling**: Global ErrorBoundary, API error handling, form validation (Yup)

## 🧪 Testing

```bash
npm test                    # Run all tests with coverage
```

- 8 test suites, 50 tests
- Covers: Redux slices, services, React components
- Framework: Jest + React Testing Library

## 🚢 Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import repo on vercel.com
3. Build command: `npm run build`
4. Output directory: `dist`
