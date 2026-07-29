import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import Logo from '../components/shared/Logo'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError("Email ou mot de passe incorrect.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await loginWithGoogle()
    } catch (err) {
      setError("Erreur lors de la connexion avec Google.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cr-gray px-5 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-sm">
        <Link to="/" className="flex justify-center mb-8"><Logo /></Link>
        <h1 className="font-display uppercase font-extrabold text-2xl text-center mb-6">Connexion</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
          <input type="password" required placeholder="Mot de passe" value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
          <div className="text-right">
            <Link to="/mot-de-passe-oublie" className="text-xs text-cr-red font-semibold">Mot de passe oublié ?</Link>
          </div>
          {error && <p className="text-sm text-cr-red">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Connexion...' : <>Se connecter <LogIn size={16} /></>}
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-cr-dark/10" />
            <span className="text-xs text-cr-dark/40">ou</span>
            <div className="flex-1 h-px bg-cr-dark/10" />
          </div>

          <button type="button" onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 border border-cr-dark/15 rounded-lg py-3 text-sm font-semibold hover:bg-cr-gray">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4C29.4 34.7 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5C9.6 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.6-4.7 6.1l6.5 5.4C40.5 36.5 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"/>
            </svg>
            Continuer avec Google
          </button>

          <p className="text-center text-sm text-cr-dark/60 pt-3">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-cr-red font-semibold">S'inscrire</Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}