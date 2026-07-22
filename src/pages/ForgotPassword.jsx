import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Logo from '../components/shared/Logo'
import { useAuth } from '../context/AuthContext'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError("Impossible d'envoyer l'email. Vérifiez l'adresse saisie.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cr-gray px-5 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-sm">
        <Link to="/" className="flex justify-center mb-8"><Logo /></Link>

        {sent ? (
          <div className="text-center py-6">
            <CheckCircle2 className="mx-auto text-green-600 mb-4" size={40} />
            <h2 className="font-display uppercase font-extrabold text-xl mb-2">Email envoyé</h2>
            <p className="text-sm text-cr-dark/60">Suivez le lien reçu par email pour réinitialiser votre mot de passe.</p>
          </div>
        ) : (
          <>
            <h1 className="font-display uppercase font-extrabold text-2xl text-center mb-2">Mot de passe oublié</h1>
            <p className="text-sm text-cr-dark/60 text-center mb-6">Saisissez votre email pour recevoir un lien de réinitialisation.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
              {error && <p className="text-sm text-cr-red">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
