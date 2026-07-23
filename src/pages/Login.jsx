import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import Logo from '../components/shared/Logo'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
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
        </form>

      </motion.div>
    </div>
  )
}