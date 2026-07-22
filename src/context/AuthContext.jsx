import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadRole = async (userId) => {
    if (!userId) {
      setRole(null)
      return
    }
    const { data } = await supabase.from('utilisateurs').select('role').eq('id', userId).single()
    setRole(data?.role || 'membre')
  }

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return
      setUser(session?.user || null)
      await loadRole(session?.user?.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null)
      await loadRole(session?.user?.id)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const loginWithGoogle = async () => {
    // Redirection OAuth : la création du profil dans "utilisateurs" est gérée
    // automatiquement côté base de données (voir supabase/schema.sql, trigger
    // on_auth_user_created) dès la création du compte.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  const register = async (email, password, nom) => {
    // Le profil "utilisateurs" (role: membre) est créé automatiquement par un
    // trigger PostgreSQL dès l'insertion dans auth.users (voir supabase/schema.sql).
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nom } },
    })
    if (error) throw error
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/mot-de-passe-oublie`,
    })
    if (error) throw error
  }

  const logout = () => supabase.auth.signOut()

  const isAdmin = role === 'admin'

  return (
    <AuthContext.Provider
      value={{ user, role, isAdmin, loading, login, loginWithGoogle, register, resetPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
