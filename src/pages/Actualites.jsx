import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { CATEGORIES, categorieLabel } from '../utils/articleCategories'

const FILTERS = [{ value: 'tous', label: 'Toutes' }, ...CATEGORIES]

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
          {FILTERS.map((c) => (
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
                  <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                    <img src={a.image_url} alt={a.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {a.pdf_url && (
                      <span className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5">
                        <FileText size={14} className="text-cr-red" />
                      </span>
                    )}
                  </div>
                  <span className="eyebrow">{categorieLabel(a.categorie)}</span>
                  <p className="text-xs text-cr-dark/40 mt-1">
                    {toDate(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {a.auteur ? ` · ${a.auteur}` : ''}
                  </p>
                  <h3 className="font-display uppercase font-bold text-lg mt-1 mb-1">{a.titre}</h3>
                  <p className="text-sm text-cr-dark/60 line-clamp-2">{a.extrait}</p>
                  {(a.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {a.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[11px] bg-cr-gray px-2 py-0.5 rounded-full text-cr-dark/60">{t}</span>
                      ))}
                    </div>
                  )}
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