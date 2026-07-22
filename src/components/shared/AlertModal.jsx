import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle2, AlertTriangle } from 'lucide-react'
import { supabase } from '../../supabase/config'

const TYPES = [
  { value: 'urgence', label: 'Urgence médicale' },
  { value: 'incendie', label: 'Incendie' },
  { value: 'sante', label: 'Problème de santé' },
  { value: 'social', label: 'Détresse sociale' },
  { value: 'autre', label: 'Autre' },
]

const initialForm = {
  nom: '',
  email: '',
  telephone: '',
  type_urgence: 'urgence',
  localisation: '',
  description: '',
}

export default function AlertModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const { error: insertError } = await supabase.from('signalements').insert({
        ...form,
        statut: 'nouveau',
      })
      if (insertError) throw insertError
      setSent(true)
      setForm(initialForm)
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer ou appeler directement le 1400.")
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setSent(false)
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white w-full md:max-w-lg md:rounded-2xl rounded-t-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="text-cr-red" size={20} />
                </div>
                <h3 className="font-display uppercase font-extrabold text-xl">Cri d'alerte</h3>
              </div>
              <button onClick={handleClose} aria-label="Fermer" className="text-cr-dark/50 hover:text-cr-dark">
                <X size={22} />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <CheckCircle2 className="mx-auto text-green-600 mb-3" size={48} />
                <p className="font-semibold text-lg mb-1">Signalement envoyé</p>
                <p className="text-sm text-cr-dark/70 mb-6">
                  Une équipe de la Croix-Rouge Gabonaise va examiner votre demande. En cas de danger immédiat, appelez le 1400.
                </p>
                <button onClick={handleClose} className="btn-primary w-full">Fermer</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-sm text-cr-dark/60 mb-2">
                  Décrivez la situation. Notre équipe traitera votre signalement dans les meilleurs délais.
                </p>
                <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom complet"
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                <div className="grid grid-cols-2 gap-3">
                  <input name="telephone" value={form.telephone} onChange={handleChange} required placeholder="Téléphone"
                    className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email (optionnel)"
                    className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                </div>
                <select name="type_urgence" value={form.type_urgence} onChange={handleChange}
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red">
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input name="localisation" value={form.localisation} onChange={handleChange} required placeholder="Localisation (quartier, ville)"
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Décrivez la situation"
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red resize-none" />
                {error && <p className="text-sm text-cr-red">{error}</p>}
                <button type="submit" disabled={sending} className="btn-primary w-full mt-2 disabled:opacity-60">
                  {sending ? 'Envoi...' : <>Envoyer le signalement <Send size={16} /></>}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
