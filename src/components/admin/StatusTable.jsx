import { useState } from 'react'
import { Trash2, Eye, X } from 'lucide-react'
import { supabase } from '../../supabase/config'

const formatValue = (value) => {
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—'
  if (!value && value !== 0) return '—'
  return value
}

const formatDate = (value) => {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
  } catch {
    return value
  }
}

/**
 * Table de gestion des soumissions utilisateur (dons, candidatures, signalements) :
 * lecture des champs + changement de statut, sans formulaire de création.
 * Un bouton "Consulter" ouvre une fiche complète (tous les champs) pour
 * permettre à l'admin de traiter la demande en connaissance de cause.
 */
export default function StatusTable({ collectionName, data, columns, statuses, detailFields = [] }) {
  const [viewing, setViewing] = useState(null)

  const updateStatus = async (id, statut) => {
    await supabase.from(collectionName).update({ statut }).eq('id', id)
    setViewing((v) => (v && v.id === id ? { ...v, statut } : v))
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet élément définitivement ?')) return
    await supabase.from(collectionName).delete().eq('id', id)
    setViewing((v) => (v && v.id === id ? null : v))
  }

  const fullFields = [...columns, ...detailFields]

  return (
    <div className="bg-white rounded-xl overflow-x-auto shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-cr-gray text-left">
          <tr>
            {columns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold whitespace-nowrap">{c.label}</th>)}
            <th className="px-4 py-3 font-semibold">Statut</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t border-cr-dark/5">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 max-w-[220px] truncate">{formatValue(item[c.key])}</td>
              ))}
              <td className="px-4 py-3">
                <select value={item.statut || statuses[0]} onChange={(e) => updateStatus(item.id, e.target.value)}
                  className="border border-cr-dark/15 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-cr-red">
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button onClick={() => setViewing(item)} className="p-1.5 rounded hover:bg-cr-gray text-cr-dark/70" title="Consulter">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-red-50 text-cr-red" title="Supprimer">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!data.length && (
            <tr><td colSpan={columns.length + 2} className="px-4 py-10 text-center text-cr-dark/40">Aucune donnée pour le moment.</td></tr>
          )}
        </tbody>
      </table>

      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display uppercase font-bold text-lg">Détail de la demande</h3>
              <button onClick={() => setViewing(null)}><X size={20} /></button>
            </div>

            <div className="space-y-3">
              {fullFields.map((f) => (
                <div key={f.key}>
                  <span className="text-xs font-semibold text-cr-dark/50 uppercase block mb-0.5">{f.label}</span>
                  <p className="text-sm text-cr-dark whitespace-pre-wrap">{formatValue(viewing[f.key])}</p>
                </div>
              ))}
              <div>
                <span className="text-xs font-semibold text-cr-dark/50 uppercase block mb-0.5">Reçu le</span>
                <p className="text-sm text-cr-dark">{formatDate(viewing.cree_le)}</p>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-cr-dark/10">
              <span className="text-xs font-semibold text-cr-dark/60 mb-1.5 block">Statut du traitement</span>
              <select
                value={viewing.statut || statuses[0]}
                onChange={(e) => updateStatus(viewing.id, e.target.value)}
                className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red"
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => handleDelete(viewing.id)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-cr-red border border-cr-red/30 hover:bg-red-50">
                Supprimer
              </button>
              <button onClick={() => setViewing(null)} className="flex-1 btn-primary !py-2.5">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
