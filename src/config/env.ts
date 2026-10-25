export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1',
  useMock: import.meta.env.VITE_USE_MOCK !== 'false',
  appName: import.meta.env.VITE_APP_NAME ?? 'Pharma Tool',
}