import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import { supabase } from '../../supabase/config'
import LoadingSpinner from '../shared/LoadingSpinner'

const SECTIONS = [
  { cle: 'histoire', titre: 'Notre histoire' },
  { cle: 'mission', titre: 'Notre mission' },
  { cle: 'vision', titre: 'Notre vision' },
  { cle: 'valeurs', titre: 'Nos valeurs' },
  { cle: 'promesse', titre: 'Notre promesse' },
  { cle: 'organisation', titre: 'Notre organisation' },
]

export default function AProposTab() {
  const { data, loading } = useSupabaseCollection('contenus')
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(null)
  const [saved, setSaved] = useState(null)

  useEffect(() => {
    if (!loading) {
      const init = {}
      SECTIONS.forEach((s) => {
        init[s.cle] = data.find((c) => c.cle === s.cle)?.valeur || ''
      })
      setValues(init)
    }
  }, [loading, data])

  const handleSave = async (cle, titre) => {
    setSaving(cle)
    setSaved(null)
    try {
      const existing = data.find((c) => c.cle === cle)
      if (existing) {
        const { error } = await supabase.from('contenus').update({ valeur: values[cle], titre }).eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('contenus').insert({ cle, titre, valeur: values[cle], section: 'a_propos' })
        if (error) throw error
      }
      setSaved(cle)
      setTimeout(() => setSaved(null), 2000)
    } catch (err) {
      alert("Erreur lors de l'enregistrement : " + err.message)
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <p className="text-sm text-cr-dark/50">
        Ce texte apparaît sur la page publique « Qui sommes-nous ? ». Modifiez chaque section puis enregistrez-la.
      </p>
      {SECTIONS.map((s) => (
        <div key={s.cle} className="bg-white rounded-xl p-5 shadow-sm">
          <label className="font-display uppercase font-bold text-sm mb-2 block">{s.titre}</label>
          <textarea
            rows={5}
            value={values[s.cle] || ''}
            onChange={(e) => setValues((v) => ({ ...v, [s.cle]: e.target.value }))}
            className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red mb-3"
          />
          <button
            onClick={() => handleSave(s.cle, s.titre)}
            disabled={saving === s.cle}
            className="btn-primary !py-2 !px-4 text-xs disabled:opacity-60"
          >
            {saved === s.cle ? <><Check size={14} /> Enregistré</> : saving === s.cle ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      ))}
    </div>
  )
}
