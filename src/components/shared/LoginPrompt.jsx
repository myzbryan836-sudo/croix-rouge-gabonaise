import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const STORAGE_KEY = 'login_prompt_dismissed'
const DELAY_MS = 10000

export default function LoginPrompt() {
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (loading || user) return
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [loading, user])

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  if (user) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-5 right-5 z-[95] max-w-sm bg-white rounded-xl shadow-xl border border-cr-dark/10 p-4 flex gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Bell className="text-cr-red" size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-cr-dark">Ne manquez rien</p>
            <p className="text-xs text-cr-dark/60 mt-0.5">
              Connectez-vous pour suivre l'actualité de la Croix-Rouge Gabonaise en temps réel.
            </p>
            <Link
              to="/connexion"
              onClick={dismiss}
              className="text-xs font-semibold text-cr-red mt-1.5 inline-block hover:underline"
            >
              Se connecter
            </Link>
          </div>
          <button onClick={dismiss} className="text-cr-dark/40 hover:text-cr-dark shrink-0" aria-label="Fermer">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}