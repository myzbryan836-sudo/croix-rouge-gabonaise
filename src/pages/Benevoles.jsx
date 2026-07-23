import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, HandHeart, Download } from 'lucide-react'
import { supabase } from '../supabase/config'

const DISPONIBILITES = [
  { value: 'week_end', label: 'Week-end' },
  { value: 'semaine', label: 'En semaine' },
  { value: 'plein_temps', label: 'Plein temps' },
  { value: 'occasionnel', label: 'Occasionnel' },
]

const initialForm = { nom: '', email: '', telephone: '', ville: '', disponibilites: [], competences: '', motivation: '' }

export default function Benevoles() {
  const [form, setForm] = useState(initialForm)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const toggleDispo = (v) => {
    setForm((f) => ({
      ...f,
      disponibilites: f.disponibilites.includes(v) ? f.disponibilites.filter((d) => d !== v) : [...f.disponibilites, v],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const { error: insertError } = await supabase.from('candidatures_benevoles').insert({
        ...form,
        statut: 'nouveau',
      })
      if (insertError) throw insertError
      setSent(true)
      setForm(initialForm)
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">Rejoignez-nous</span>
        <h1 className="section-title mb-4">Devenir bénévole</h1>
        <p className="text-cr-dark/60 mb-6">
          Rejoignez un réseau engagé de bénévoles présents dans toutes les provinces du Gabon. Formation assurée, encadrement de terrain.
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-display uppercase font-extrabold text-sm mb-1">App « Carnet de terrain »</p>
            <p className="text-cr-dark/60 text-sm">
              Application dédiée aux volontaires pour remonter les signalements depuis le terrain, même sans connexion internet.
            </p>
          </div>
          
            href="/carnet-terrain.apk"
            download
            className="btn-primary whitespace-nowrap"
          >
            <Download size={16} /> Télécharger l'app (Android)
          </a>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <CheckCircle2 className="mx-auto text-green-600 mb-4" size={56} />
              <h2 className="font-display uppercase font-extrabold text-2xl mb-2">Candidature envoyée</h2>
              <p className="text-cr-dark/60">Merci pour votre engagement ! Notre équipe des ressources bénévoles vous recontactera très prochainement.</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom complet"
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                <input name="ville" value={form.ville} onChange={handleChange} required placeholder="Ville"
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email"
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                <input name="telephone" value={form.telephone} onChange={handleChange} required placeholder="Téléphone"
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
              </div>

              <div>
                <p className="font-semibold text-sm mb-2">Disponibilités</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DISPONIBILITES.map((d) => (
                    <button type="button" key={d.value} onClick={() => toggleDispo(d.value)}
                      className={`py-2 rounded-lg text-xs font-semibold border ${form.disponibilites.includes(d.value) ? 'bg-cr-red text-white border-cr-red' : 'border-cr-dark/15'}`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea name="competences" value={form.competences} onChange={handleChange} rows={2} placeholder="Compétences (premiers secours, logistique, communication...)"
                className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red resize-none" />
              <textarea name="motivation" value={form.motivation} onChange={handleChange} required rows={3} placeholder="Votre motivation"
                className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red resize-none" />

              {error && <p className="text-sm text-cr-red">{error}</p>}

              <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                {sending ? 'Envoi...' : <>Envoyer ma candidature <HandHeart size={16} /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
