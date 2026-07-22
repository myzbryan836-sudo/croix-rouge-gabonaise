import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail } from 'lucide-react'
import Logo from '../components/shared/Logo'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form.email, form.password, form.nom)
      setDone(true)
    } catch (err) {
      setError("Impossible de créer le compte. L'email est peut-être déjà utilisé.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cr-gray px-5 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-sm">
        <Link to="/" className="flex justify-center mb-8"><Logo /></Link>

        {done ? (
          <div className="text-center py-6">
            <Mail className="mx-auto text-cr-red mb-4" size={40} />
            <h2 className="font-display uppercase font-extrabold text-xl mb-2">Vérifiez votre email</h2>
            <p className="text-sm text-cr-dark/60 mb-6">
              Un lien de confirmation a été envoyé à {form.email}. Cliquez dessus pour activer votre compte.
            </p>
            <button onClick={() => navigate('/connexion')} className="btn-primary w-full">Aller à la connexion</button>
          </div>
        ) : (
          <>
            <h1 className="font-display uppercase font-extrabold text-2xl text-center mb-6">Créer un compte</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="nom" required placeholder="Nom complet" value={form.nom} onChange={handleChange}
                className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
              <input name="email" type="email" required placeholder="Email" value={form.email} onChange={handleChange}
                className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
              <input name="password" type="password" required minLength={6} placeholder="Mot de passe (min. 6 caractères)" value={form.password} onChange={handleChange}
                className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
              {error && <p className="text-sm text-cr-red">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? 'Création...' : <>Créer mon compte <UserPlus size={16} /></>}
              </button>
            </form>
            <p className="text-center text-sm text-cr-dark/60 mt-6">
              Déjà un compte ? <Link to="/connexion" className="text-cr-red font-semibold">Se connecter</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
