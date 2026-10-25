import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { RoleGuard } from './auth/RoleGuard'
import { AppLayout } from './components/layout/AppLayout'
import { LoadingState } from './components/common/LoadingState'
import type { Role } from './types'

const standardRoles: Role[] = ['ADMIN', 'DEVELOPER', 'CLIENT']
const LoginPage = lazy(async () => ({ default: (await import('./pages/LoginPage')).LoginPage }))
const IngredientPage = lazy(async () => ({ default: (await import('./pages/ingredients/IngredientPage')).IngredientPage }))
const HuntPage = lazy(async () => ({ default: (await import('./pages/hunt/HuntPage')).HuntPage }))
const SummarizeDashboardPage = lazy(async () => ({ default: (await import('./pages/summarize-dashboard/SummarizeDashboardPage')).SummarizeDashboardPage }))
const DocumentUploadPage = lazy(async () => ({ default: (await import('./pages/document-upload/DocumentUploadPage')).DocumentUploadPage }))
const SummarizePage = lazy(async () => ({ default: (await import('./pages/summarize/SummarizePage')).SummarizePage }))
const CountryUpdatesPage = lazy(async () => ({ default: (await import('./pages/country-updates/CountryUpdatesPage')).CountryUpdatesPage }))
const ImpactAssessmentPage = lazy(async () => ({ default: (await import('./pages/ri-operations/ImpactAssessmentPage')).ImpactAssessmentPage }))
const WatchlistPage = lazy(async () => ({ default: (await import('./pages/ri-operations/WatchlistPage')).WatchlistPage }))
const ProjectsPage = lazy(async () => ({ default: (await import('./pages/ri-operations/ProjectsPage')).ProjectsPage }))
const RiDocumentsPage = lazy(async () => ({ default: (await import('./pages/ri-operations/RiDocumentsPage')).RiDocumentsPage }))
const CmcDashboardPage = lazy(async () => ({ default: (await import('./pages/cmc/CmcDashboardPage')).CmcDashboardPage }))
const UserManagementPage = lazy(async () => ({ default: (await import('./pages/admin/UserManagementPage')).UserManagementPage }))
const AuditLogPage = lazy(async () => ({ default: (await import('./pages/admin/AuditLogPage')).AuditLogPage }))
const NotFoundPage = lazy(async () => ({ default: (await import('./pages/NotFoundPage')).NotFoundPage }))
const ForbiddenPage = lazy(async () => ({ default: (await import('./pages/ForbiddenPage')).ForbiddenPage }))

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/summarize" replace />} />
              <Route path="/summarize" element={<SummarizePage />} />
              <Route path="/ingredients" element={<IngredientPage />} />
              <Route path="/hunt" element={<HuntPage />} />
              <Route element={<RoleGuard allowedRoles={standardRoles} />}>
                <Route path="/summarize-dashboard" element={<SummarizeDashboardPage />} />
              </Route>
              <Route path="/country-updates" element={<CountryUpdatesPage />} />
              <Route element={<RoleGuard allowedRoles={standardRoles} />}>
                <Route path="/ri-operations/impact-assessment" element={<ImpactAssessmentPage />} />
                <Route path="/ri-operations/watchlist" element={<WatchlistPage />} />
                <Route path="/ri-operations/projects" element={<ProjectsPage />} />
                <Route path="/ri-operations/documents" element={<RiDocumentsPage />} />
                <Route path="/document-upload" element={<DocumentUploadPage />} />
                <Route path="/cmc-dashboard" element={<CmcDashboardPage />} />
              </Route>
              <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                <Route path="/admin/users" element={<UserManagementPage />} />
              </Route>
              <Route element={<RoleGuard allowedRoles={['ADMIN', 'DEVELOPER']} />}>
                <Route path="/admin/audit" element={<AuditLogPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
