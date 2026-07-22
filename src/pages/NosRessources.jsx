import { useState } from 'react'
import { FileText, Download, PlayCircle } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const CATEGORIES = [
  { value: 'tous', label: 'Tout' },
  { value: 'rapport', label: 'Rapports' },
  { value: 'publication', label: 'Publications' },
  { value: 'document_officiel', label: 'Documents officiels' },
  { value: 'photo', label: 'Photos' },
  { value: 'video', label: 'Vidéos' },
]

function RessourceVisual({ ressource }) {
  const { categorie, fichier_url, image_url, titre } = ressource

  if (categorie === 'video' && fichier_url) {
    return (
      <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-cr-dark">
        <video src={fichier_url} poster={image_url || undefined} className="w-full h-full object-cover" controls preload="metadata" />
      </div>
    )
  }

  if (categorie === 'photo' && fichier_url) {
    return (
      <div className="h-48 rounded-2xl overflow-hidden mb-4">
        <img src={fichier_url} alt={titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
    )
  }

  if (image_url) {
    return (
      <div className="h-48 rounded-2xl overflow-hidden mb-4">
        <img src={image_url} alt={titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
    )
  }

  return (
    <div className="h-48 rounded-2xl overflow-hidden mb-4 bg-cr-gray flex items-center justify-center">
      {categorie === 'video' ? (
        <PlayCircle size={36} className="text-cr-red/40" />
      ) : (
        <FileText size={36} className="text-cr-red/40" />
      )}
    </div>
  )
}

export default function NosRessources() {
  const { data, loading } = useSupabaseCollection('ressources', { statut: 'publie', orderByField: 'ordre', orderDirection: 'asc' })
  const [searchParams] = useSearchParams()
  const initialCategorie = searchParams.get('categorie')
  const [filter, setFilter] = useState(CATEGORIES.some((c) => c.value === initialCategorie) ? initialCategorie : 'tous')

  const filtered = filter === 'tous' ? data : data.filter((r) => r.categorie === filter)

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">Documentation</span>
        <h1 className="section-title mb-4">Nos ressources</h1>
        <p className="text-cr-dark/60 max-w-2xl mb-10">
          Rapports d'activité, publications, documents officiels, photos et vidéos publiés par la Croix-Rouge Gabonaise.
        </p>

        <div className="flex gap-2 mb-8 flex-wrap">
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

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <p className="text-cr-dark/40 py-10 text-center">Information en cours de mise à jour.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <a
                key={r.id}
                href={r.fichier_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="group bg-white rounded-2xl p-4 shadow-sm border border-cr-dark/5 flex flex-col hover:shadow-md transition-shadow"
              >
                <RessourceVisual ressource={r} />
                <span className="eyebrow">{CATEGORIES.find((c) => c.value === r.categorie)?.label}</span>
                <h3 className="font-display uppercase font-bold text-base mt-1 mb-2">{r.titre}</h3>
                <p className="text-sm text-cr-dark/60 flex-1 line-clamp-3">{r.description}</p>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-cr-red mt-4">
                  <Download size={13} /> Consulter
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
