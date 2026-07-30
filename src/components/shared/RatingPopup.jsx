import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Star, X, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../supabase/config'

const STORAGE_KEY = 'avis_site_done'
const DELAY_MS = 25000

export default function RatingPopup() {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(0)
  const [hoverNote, setHoverNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const close = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  const handleSubmit = async () => {
    if (!note) return
    setSending(true)
    try {
      await supabase.from('avis_site').insert({ note, commentaire: commentaire || null })
      setSent(true)
      localStorage.setItem(STORAGE_KEY, '1')
      setTimeout(() => setOpen(false), 1800)
    } catch (err) {
      alert("Erreur lors de l'envoi de votre avis : " + err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] bg-black/50 flex items-end md:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm relative"
          >
            <button onClick={close} className="absolute top-4 right-4 text-cr-dark/40 hover:text-cr-dark" aria-label="Fermer">
              <X size={18} />
            </button>

            {sent ? (
              <div className="text-center py-6">
                <CheckCircle2 className="mx-auto text-green-600 mb-3" size={40} />
                <p className="font-semibold">Merci pour votre avis !</p>
              </div>
            ) : (
              <>
                <h3 className="font-display uppercase font-extrabold text-lg mb-1">Votre avis compte</h3>
                <p className="text-sm text-cr-dark/60 mb-4">Que pensez-vous de notre site ?</p>

                <div className="flex gap-1.5 justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNote(n)}
                      onMouseEnter={() => setHoverNote(n)}
                      onMouseLeave={() => setHoverNote(0)}
                      aria-label={n + ' étoile(s)'}
                    >
                      <Star
                        size={32}
                        className={(hoverNote || note) >= n ? 'text-yellow-400' : 'text-cr-dark/20'}
                        fill={(hoverNote || note) >= n ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Un commentaire (optionnel)"
                  className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red resize-none mb-4"
                />

                <button
                  onClick={handleSubmit}
                  disabled={!note || sending}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {sending ? 'Envoi...' : 'Envoyer mon avis'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}