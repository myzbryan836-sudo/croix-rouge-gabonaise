import { useEffect, useState } from 'react'
import { supabase } from '../../supabase/config'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'numero_vert', label: 'Numéro vert (urgence)' },
  { name: 'whatsapp', label: 'WhatsApp officiel' },
  { name: 'email', label: 'Email officiel' },
  { name: 'adresse', label: 'Adresse physique' },
  { name: 'gps_lat', label: 'Latitude GPS', type: 'number' },
  { name: 'gps_lng', label: 'Longitude GPS', type: 'number' },
  { name: 'horaires', label: 'Horaires d\u2019ouverture' },
]

export default function ContactTab() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('contact_infos').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      setForm(data || { id: 1 })
      setLoading(false)
    })
  }, [])

  const handleChange = (name, value) => {
    setSaved(false)
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { id, maj_le, ...payload } = form
      const { error } = await supabase.from('contact_infos').upsert({ id: 1, ...payload })
      if (error) throw error
      setSaved(true)
    } catch (err) {
      alert("Erreur lors de l'enregistrement : " + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) return <LoadingSpinner />

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm max-w-xl">
      <p className="text-sm text-cr-dark/50 mb-5">
        Ces informations alimentent le pied de page, la page Contact et le bouton d'urgence du site.
      </p>
      <div className="space-y-3">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">{f.label}</label>
            <input
              type={f.type === 'number' ? 'number' : 'text'}
              value={form[f.name] ?? ''}
              onChange={(e) => handleChange(f.name, e.target.value)}
              className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red"
            />
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={saving} className="btn-primary w-full mt-5 disabled:opacity-60">
        {saving ? 'Enregistrement...' : saved ? 'Enregistré ✓' : 'Enregistrer'}
      </button>
    </div>
  )
}
