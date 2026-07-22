import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react'
import { supabase } from '../../supabase/config'
import GpsPicker from './GpsPicker'

/**
 * Table CRUD générique pilotée par une config de champs.
 * fields: [{ name, label, type: 'text'|'textarea'|'number'|'select'|'image'|'list', options }]
 */
export default function DataTable({ collectionName, fields, data, titleField = 'titre' }) {
  const [editing, setEditing] = useState(null) // null = fermé, {} = création, {...} = édition
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (name, file) => {
    if (!file) return
    setUploading(true)
    try {
      const path = `${collectionName}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage.from('media').upload(path, file)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      handleChange(name, data.publicUrl)
    } catch (err) {
      alert("Erreur lors de l'envoi du fichier : " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const openCreate = () => {
    const empty = {}
    fields.forEach((f) => {
      if (f.type === 'gps') {
        empty[f.latField] = ''
        empty[f.lngField] = ''
      } else {
        empty[f.name] = f.type === 'list' ? [] : ''
      }
    })
    setEditing(empty)
  }

  const openEdit = (item) => setEditing({ ...item })

  const handleChange = (name, value) => setEditing((e) => ({ ...e, [name]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const { id, ...payload } = editing
      if (id) {
        const { error } = await supabase.from(collectionName).update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from(collectionName).insert(payload)
        if (error) throw error
      }
      setEditing(null)
    } catch (err) {
      alert("Erreur lors de l'enregistrement : " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet élément définitivement ?')) return
    await supabase.from(collectionName).delete().eq('id', id)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-cr-dark/50">{data.length} élément(s)</p>
        <button onClick={openCreate} className="btn-primary !py-2 !px-4 text-xs">
          <Plus size={15} /> Ajouter
        </button>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-cr-gray text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Titre</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t border-cr-dark/5">
                <td className="px-4 py-3">{item[titleField] || item.nom || item.label || item.cle || '—'}</td>
                <td className="px-4 py-3">
                  {item.statut && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      ['publie', 'complete', 'accepte', 'traite'].includes(item.statut)
                        ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.statut}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-cr-gray"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-red-50 text-cr-red"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!data.length && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-cr-dark/40">Aucune donnée pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display uppercase font-bold text-lg">{editing.id ? 'Modifier' : 'Ajouter'}</h3>
              <button onClick={() => setEditing(null)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea rows={3} value={editing[f.name] || ''} onChange={(e) => handleChange(f.name, e.target.value)}
                      className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                  ) : f.type === 'select' ? (
                    <select value={editing[f.name] || ''} onChange={(e) => handleChange(f.name, e.target.value)}
                      className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red">
                      <option value="">—</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === 'image' ? (
                    <div className="space-y-2">
                      <input value={editing[f.name] || ''} onChange={(e) => handleChange(f.name, e.target.value)} placeholder="URL de l'image"
                        className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                      <label className="flex items-center gap-2 text-xs font-semibold text-cr-red cursor-pointer w-fit">
                        <Upload size={14} /> {uploading ? 'Envoi...' : 'Téléverser un fichier'}
                        <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleUpload(f.name, e.target.files[0])} />
                      </label>
                      {editing[f.name] && <img src={editing[f.name]} alt="" className="h-20 rounded-lg object-cover" />}
                    </div>
                  ) : f.type === 'gps' ? (
                    <GpsPicker
                      lat={editing[f.latField]}
                      lng={editing[f.lngField]}
                      onChange={(newLat, newLng) => setEditing((e) => ({ ...e, [f.latField]: newLat, [f.lngField]: newLng }))}
                    />
                  ) : f.type === 'list' ? (
                    <textarea rows={3} placeholder="Une ligne par élément" value={(editing[f.name] || []).join('\n')}
                      onChange={(e) => handleChange(f.name, e.target.value.split('\n').filter(Boolean))}
                      className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                  ) : (
                    <input type={f.type === 'number' ? 'number' : 'text'} value={editing[f.name] || ''} onChange={(e) => handleChange(f.name, e.target.value)}
                      className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary w-full mt-5 disabled:opacity-60">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
