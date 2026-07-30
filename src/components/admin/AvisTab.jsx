import { Star } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import LoadingSpinner from '../shared/LoadingSpinner'

function StarsDisplay({ note }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={15} className={n <= note ? 'text-yellow-400' : 'text-cr-dark/15'} fill={n <= note ? 'currentColor' : 'none'} />
      ))}
    </div>
  )
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return '—'
  }
}

export default function AvisTab() {
  const { data, loading } = useSupabaseCollection('avis_site', { orderByField: 'cree_le', orderDirection: 'desc' })
  if (loading) return <LoadingSpinner />

  const moyenne = data.length ? (data.reduce((sum, a) => sum + a.note, 0) / data.length) : 0

  return (
    <div>
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6 flex items-center gap-6">
        <div>
          <p className="text-4xl font-display font-extrabold text-cr-dark">{moyenne.toFixed(1)}<span className="text-lg text-cr-dark/40"> / 5</span></p>
          <p className="text-xs text-cr-dark/50 mt-1">{data.length} avis reçu(s)</p>
        </div>
        <StarsDisplay note={Math.round(moyenne)} />
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-cr-gray text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Note</th>
              <th className="px-4 py-3 font-semibold">Commentaire</th>
              <th className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a) => (
              <tr key={a.id} className="border-t border-cr-dark/5">
                <td className="px-4 py-3"><StarsDisplay note={a.note} /></td>
                <td className="px-4 py-3 text-cr-dark/70 max-w-md">{a.commentaire || <span className="text-cr-dark/30">—</span>}</td>
                <td className="px-4 py-3 text-cr-dark/50 whitespace-nowrap">{formatDate(a.cree_le)}</td>
              </tr>
            ))}
            {!data.length && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-cr-dark/40">Aucun avis pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}