import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, HeartPulse, Users, GraduationCap, X, Heart, HandHeart, MapPinned } from 'lucide-react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const ICONS = { urgence: AlertTriangle, sante: HeartPulse, social: Users, formation: GraduationCap, prevention: Users }
const FILTERS = [
  { value: 'tous', label: 'Toutes' },
  { value: 'urgence', label: 'Urgences' },
  { value: 'sante', label: 'Santé' },
  { value: 'social', label: 'Social' },
  { value: 'formation', label: 'Formation' },
  { value: 'prevention', label: 'Prévention' },
]

export default function Missions() {
  const { data, loading } = useSupabaseCollection('missions', { statut: 'publie', orderByField: 'ordre', orderDirection: 'asc' })
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const initialCategorie = searchParams.get('categorie')
  const [filter, setFilter] = useState(FILTERS.some((f) => f.value === initialCategorie) ? initialCategorie : 'tous')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (!loading && location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }, [loading, location.hash])

  const filtered = filter === 'tous' ? data : data.filter((m) => m.icone === filter)
  const gallery = filtered.filter((m) => m.image_url)

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">Ce que nous faisons</span>
        <h1 className="section-title mb-4">Nos missions</h1>
        <p className="text-cr-dark/60 max-w-2xl mb-6">
          Réparties en quatre grands domaines d'intervention, nos actions couvrent l'ensemble du territoire gabonais.
        </p>
        <Link to="/carte-interventions" className="inline-flex items-center gap-2 text-sm font-bold uppercase text-cr-red hover:underline mb-12">
          <MapPinned size={16} /> Voir la carte de nos interventions
        </Link>

        {loading ? <LoadingSpinner /> : (
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {data.map((m, i) => {
              const Icon = ICONS[m.icone] || Users
              return (
                <motion.div
                  key={m.id}
                  id={`mission-${m.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cr-dark/5 scroll-mt-28"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img src={m.image_url} alt={m.titre} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-white/90 text-cr-red text-[11px] font-bold uppercase px-2.5 py-1 rounded-full">{m.badge}</span>
                  </div>
                  <div className="p-6">
                    <Icon className="text-cr-red mb-3" size={24} />
                    <h3 className="font-display uppercase font-extrabold text-xl mb-2">{m.titre}</h3>
                    <p className="text-sm text-cr-dark/60 mb-4">{m.description}</p>
                    {Array.isArray(m.actions) && m.actions.length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {m.actions.map((a, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cr-red mt-1.5 shrink-0" /> {a}
                          </li>
                        ))}
                      </ul>
                    )}
                    {m.stat && <p className="text-xs font-bold uppercase tracking-wide text-cr-red">{m.stat}</p>}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <div className="mb-8">
          <h2 className="section-title mb-6">Galerie</h2>
          <div className="flex gap-2 mb-8 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-colors ${
                  filter === f.value ? 'bg-cr-red text-white' : 'bg-cr-gray text-cr-dark/70 hover:bg-cr-dark/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((m) => (
              <button key={m.id} onClick={() => setLightbox(m)} className="aspect-square rounded-xl overflow-hidden group">
                <img src={m.image_url} alt={m.titre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-16">
          <Link to="/dons" className="bg-cr-red text-white rounded-2xl p-8 flex items-center justify-between hover:opacity-95">
            <span className="font-display uppercase font-bold text-xl">Soutenir nos missions</span>
            <Heart size={26} />
          </Link>
          <Link to="/benevoles" className="bg-cr-dark text-white rounded-2xl p-8 flex items-center justify-between hover:opacity-95">
            <span className="font-display uppercase font-bold text-xl">Devenir bénévole</span>
            <HandHeart size={26} />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white" onClick={() => setLightbox(null)}><X size={28} /></button>
            <motion.img
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              src={lightbox.image_url} alt={lightbox.titre}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
