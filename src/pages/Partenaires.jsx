import { useState } from 'react'
import { ExternalLink, Handshake } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const CATEGORIES = [
  { value: 'tous', label: 'Tous' },
  { value: 'institution_publique', label: 'Institutions publiques' },
  { value: 'entreprise', label: 'Entreprises' },
  { value: 'ong', label: 'ONG' },
  { value: 'organisation_internationale', label: 'Organisations internationales' },
  { value: 'partenaire_technique_financier', label: 'Partenaires techniques & financiers' },
]

export default function Partenaires() {
  const { data, loading } = useSupabaseCollection('partenaires', { statut: 'publie', orderByField: 'ordre', orderDirection: 'asc' })
  const [filter, setFilter] = useState('tous')

  const filtered = filter === 'tous' ? data : data.filter((p) => p.categorie === filter)

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">Ils nous soutiennent</span>
        <h1 className="section-title mb-4">Nos partenaires</h1>
        <p className="text-cr-dark/60 max-w-2xl mb-10">
          Institutions, entreprises et organisations qui accompagnent nos actions humanitaires partout au Gabon.
        </p>

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

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-cr-dark/5 text-center">
            <Handshake className="text-cr-red mx-auto mb-4" size={32} />
            <p className="text-cr-dark/40">Information en cours de mise à jour.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-6 shadow-sm border border-cr-dark/5 flex flex-col">
                <div className="h-16 flex items-center mb-4">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.nom} className="max-h-16 max-w-[140px] object-contain" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-cr-red/10 text-cr-red flex items-center justify-center">
                      <Handshake size={22} />
                    </div>
                  )}
                </div>
                <h3 className="font-display uppercase font-bold text-base mb-1">{p.nom}</h3>
                {p.categorie && (
                  <span className="text-[11px] font-bold uppercase tracking-wide text-cr-red mb-2">
                    {CATEGORIES.find((c) => c.value === p.categorie)?.label}
                  </span>
                )}
                <p className="text-sm text-cr-dark/60 flex-1">{p.description}</p>
                {p.lien && (
                  <a href={p.lien} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold uppercase text-cr-dark/60 hover:text-cr-red mt-4">
                    Voir le site <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
