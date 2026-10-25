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
const DietarySupplementsPage = lazy(async () => ({
  default: (await import('./pages/dietary-supplements/DietarySupplementsPage'))
    .DietarySupplementsPage,
}))
const DocumentsPage = lazy(async () => ({
  default: (await import('./pages/documents/DocumentsPage')).DocumentsPage,
}))
const SummariesDashboardPage = lazy(async () => ({
  default: (await import('./pages/summaries-dashboard/SummariesDashboardPage'))
    .SummariesDashboardPage,
}))
const DocumentUploadPage = lazy(async () => ({
  default: (await import('./pages/document-upload/DocumentUploadPage')).DocumentUploadPage,
}))
const SummariesPage = lazy(async () => ({
  default: (await import('./pages/summaries/SummariesPage')).SummariesPage,
}))
const CountryUpdatesPage = lazy(async () => ({
  default: (await import('./pages/country-updates/CountryUpdatesPage')).CountryUpdatesPage,
}))
const ImpactAssessmentPage = lazy(async () => ({
  default: (await import('./pages/operations/ImpactAssessmentPage')).ImpactAssessmentPage,
}))
const WatchlistPage = lazy(async () => ({
  default: (await import('./pages/operations/WatchlistPage')).WatchlistPage,
}))
const ProjectsPage = lazy(async () => ({
  default: (await import('./pages/operations/ProjectsPage')).ProjectsPage,
}))
const ProjectDocumentsPage = lazy(async () => ({
  default: (await import('./pages/operations/ProjectDocumentsPage')).ProjectDocumentsPage,
}))
const CmcDashboardPage = lazy(async () => ({
  default: (await import('./pages/cmc/CmcDashboardPage')).CmcDashboardPage,
}))
const UserManagementPage = lazy(async () => ({
  default: (await import('./pages/admin/UserManagementPage')).UserManagementPage,
}))
const AuditLogPage = lazy(async () => ({
  default: (await import('./pages/admin/AuditLogPage')).AuditLogPage,
}))
const NotFoundPage = lazy(async () => ({
  default: (await import('./pages/NotFoundPage')).NotFoundPage,
}))
const ForbiddenPage = lazy(async () => ({
  default: (await import('./pages/ForbiddenPage')).ForbiddenPage,
}))

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
                <Route path="/" element={<Navigate to="/summaries" replace />} />
                <Route path="/summaries" element={<SummariesPage />} />
                <Route path="/dietary-supplements" element={<DietarySupplementsPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route element={<RoleGuard allowedRoles={standardRoles} />}>
                  <Route path="/summaries-dashboard" element={<SummariesDashboardPage />} />
                </Route>
                <Route path="/country-updates" element={<CountryUpdatesPage />} />
                <Route element={<RoleGuard allowedRoles={standardRoles} />}>
                  <Route path="/operations/impact-assessment" element={<ImpactAssessmentPage />} />
                  <Route path="/operations/watchlist" element={<WatchlistPage />} />
                  <Route path="/operations/projects" element={<ProjectsPage />} />
                  <Route path="/operations/documents" element={<ProjectDocumentsPage />} />
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
