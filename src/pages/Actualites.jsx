import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const CATEGORIES = [
  { value: 'tous', label: 'Toutes' },
  { value: 'operations', label: 'Opérations' },
  { value: 'sante', label: 'Santé' },
  { value: 'formation', label: 'Formation' },
  { value: 'social', label: 'Social' },
]

function toDate(d) {
  if (!d) return new Date()
  return d.toDate ? d.toDate() : new Date(d)
}

export default function Actualites() {
  const { data, loading } = useSupabaseCollection('articles', { statut: 'publie', orderByField: 'date', orderDirection: 'desc' })
  const [filter, setFilter] = useState('tous')

  const filtered = filter === 'tous' ? data : data.filter((a) => a.categorie === filter)

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">Actualités</span>
        <h1 className="section-title mb-8">Toute l'actualité de la Croix-Rouge Gabonaise</h1>

        <div className="flex gap-2 mb-10 flex-wrap">
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

        {loading ? <LoadingSpinner /> : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={`/actualites/${a.id}`} className="group block">
                  <div className="h-48 rounded-2xl overflow-hidden mb-4">
                    <img src={a.image_url} alt={a.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span className="eyebrow">{a.categorie}</span>
                  <p className="text-xs text-cr-dark/40 mt-1">{toDate(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <h3 className="font-display uppercase font-bold text-lg mt-1 mb-1">{a.titre}</h3>
                  <p className="text-sm text-cr-dark/60 line-clamp-2">{a.extrait}</p>
                </Link>
              </motion.div>
            ))}
            {!filtered.length && <p className="text-cr-dark/50 col-span-3 text-center py-16">Aucun article dans cette catégorie pour le moment.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
