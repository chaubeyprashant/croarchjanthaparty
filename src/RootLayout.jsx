import AppLayout from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}
