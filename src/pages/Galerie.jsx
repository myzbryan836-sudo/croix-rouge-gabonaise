import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, PlayCircle, Images } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const CATEGORIES = [
  { value: 'tous', label: 'Tout' },
  { value: 'interventions', label: 'Interventions' },
  { value: 'campagnes', label: 'Campagnes' },
  { value: 'formations', label: 'Formations' },
  { value: 'benevoles', label: 'Bénévoles' },
  { value: 'evenements', label: 'Événements' },
]

export default function Galerie() {
  const { data, loading } = useSupabaseCollection('galerie_medias', { statut: 'publie', orderByField: 'ordre', orderDirection: 'asc' })
  const [filter, setFilter] = useState('tous')
  const [search, setSearch] = useState('')
  const [lightbox, setLightbox] = useState(null)

  const filtered = data
    .filter((m) => filter === 'tous' || m.categorie === filter)
    .filter((m) => !search || (m.titre || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">En images</span>
        <h1 className="section-title mb-4">Galerie</h1>
        <p className="text-cr-dark/60 max-w-2xl mb-8">
          Interventions, campagnes humanitaires, formations, activités des bénévoles et événements de la Croix-Rouge Gabonaise.
        </p>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8">
          <div className="flex gap-2 flex-wrap flex-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter(c.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-colors ${
                  filter === c.value ? 'bg-cr-red text-white' : 'bg-cr-gray text-cr-dark/70 hover:bg-cr-dark/10'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cr-dark/30" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full border border-cr-dark/15 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-cr-dark/5 text-center">
            <Images className="text-cr-red mx-auto mb-4" size={32} />
            <p className="text-cr-dark/40">Information en cours de mise à jour.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => setLightbox(m)}
                className="relative aspect-square rounded-xl overflow-hidden group bg-cr-gray"
              >
                {m.type === 'video' ? (
                  <>
                    <video src={m.url} className="w-full h-full object-cover" muted />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <PlayCircle className="text-white" size={32} />
                    </span>
                  </>
                ) : (
                  <img src={m.url} alt={m.titre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                )}
                <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-semibold px-2.5 py-2 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                  {m.titre}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white" onClick={() => setLightbox(null)}><X size={28} /></button>
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="max-h-[85vh] max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.type === 'video' ? (
                <video src={lightbox.url} controls autoPlay className="max-h-[85vh] max-w-full rounded-lg" />
              ) : (
                <img src={lightbox.url} alt={lightbox.titre} className="max-h-[85vh] max-w-full rounded-lg object-contain" />
              )}
              {lightbox.titre && <p className="text-white text-center mt-3 text-sm font-semibold">{lightbox.titre}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
