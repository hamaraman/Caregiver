import { useEffect, useState } from 'react'
import { fetchCurrentUser } from '../api'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = 로딩중

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  return { user, loading: user === undefined }
}
