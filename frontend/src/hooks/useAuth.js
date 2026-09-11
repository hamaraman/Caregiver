import { useAuthContext } from '../contexts/AuthContext'

export function useAuth() {
  const { user } = useAuthContext()
  return { user, loading: user === undefined }
}
