import { User } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'

function formatMois(value) {
  if (!value) return ''
  const d = new Date(`${value}T12:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

function periode(debut, fin) {
  const d = formatMois(debut)
  const f = formatMois(fin)
  if (d && f) return `${d} – ${f}`
  if (d) return `Depuis ${d}`
  if (f) return `Jusqu'en ${f}`
  return ''
}

export default function DirigeantsSection() {
  const { data } = useSupabaseCollection('dirigeants', { statut: 'publie', orderByField: 'ordre', orderDirection: 'asc' })
  const dirigeants = data.filter((d) => d.nom || d.prenom)

  if (!dirigeants.length) return null

  return (
    <section id="dirigeants" className="py-20">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">La Croix-Rouge Gabonaise</span>
        <h2 className="section-title mb-10">Nos dirigeants</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {dirigeants.map((d) => {
            const nomComplet = [d.prenom, d.nom].filter(Boolean).join(' ')
            const dates = periode(d.debut_fonction, d.fin_fonction)
            return (
              <div key={d.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cr-dark/5 text-center">
                <div className="aspect-[3/4] bg-cr-gray flex items-center justify-center">
                  {d.photo_url ? (
                    <img src={d.photo_url} alt={nomComplet} loading="lazy" className="w-full h-full object-cover object-top" />
                  ) : (
                    <User className="text-cr-dark/20" size={56} />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display uppercase font-bold text-sm leading-tight">{nomComplet}</h3>
                  {d.fonction && <p className="text-xs font-semibold text-cr-red mt-1">{d.fonction}</p>}
                  {dates && <p className="text-xs text-cr-dark/50 mt-1">{dates}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}