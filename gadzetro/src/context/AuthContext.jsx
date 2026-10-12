import { createContext, useCallback, useMemo, useState } from 'react'
import { clearSession, loginUser, persistSession, readSession, registerUser, updateProfile as updateProfileRequest } from '../services/authService.js'

export const AuthContext = createContext(null)

// MOCK auth state. A role check in the browser is NOT real authorization: the backend must enforce roles.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession())

  const login = useCallback(async (email, password, remember = false) => {
    const { user: loggedIn } = await loginUser({ email, password })
    persistSession(loggedIn, remember)
    setUser(loggedIn)
    return loggedIn
  }, [])

  const register = useCallback(async (data) => {
    const created = await registerUser(data)
    persistSession(created, false)
    setUser(created)
    return created
  }, [])

  const logout = useCallback(() => { clearSession(); setUser(null) }, [])

  const updateProfile = useCallback(async (values) => {
    const updated = await updateProfileRequest(user.id, values)
    setUser(updated)
    return updated
  }, [user])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isAdmin: user?.role === 'admin', login, register, logout, updateProfile }),
    [user, login, register, logout, updateProfile]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
