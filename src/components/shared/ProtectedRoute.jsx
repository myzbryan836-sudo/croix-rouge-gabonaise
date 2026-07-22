import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <LoadingSpinner full />
  if (!user) return <Navigate to="/connexion" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />

  return children
}
