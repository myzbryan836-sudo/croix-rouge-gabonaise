import { useEffect, useState } from 'react'
import { Upload } from 'lucide-react'
import { supabase } from '../../supabase/config'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { section: 'Moov Money' },
  { name: 'moov_money_numero', label: 'Numéro Moov Money' },
  { name: 'moov_money_titulaire', label: 'Nom du titulaire' },
  { name: 'moov_money_qr', label: 'QR Code Moov Money', type: 'qr' },
  { section: 'Airtel Money' },
  { name: 'airtel_money_numero', label: 'Numéro Airtel Money' },
  { name: 'airtel_money_titulaire', label: 'Nom du titulaire' },
  { name: 'airtel_money_qr', label: 'QR Code Airtel Money', type: 'qr' },
  { section: 'Compte bancaire (virement / carte)' },
  { name: 'banque_nom', label: 'Nom de la banque' },
  { name: 'banque_titulaire', label: 'Titulaire du compte' },
  { name: 'banque_numero_compte', label: 'Numéro de compte' },
  { name: 'banque_iban', label: 'IBAN' },
  { name: 'banque_qr', label: 'QR Code paiement (carte / virement)', type: 'qr' },
  { name: 'instructions_carte', label: 'Instructions affichées aux donateurs (paiement par carte)', type: 'textarea' },
]

export default function PaiementTab() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingQr, setUploadingQr] = useState({})

  useEffect(() => {
    supabase.from('moyens_paiement').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      setForm(data || { id: 1 })
      setLoading(false)
    })
  }, [])

  const handleChange = (name, value) => {
    setSaved(false)
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleQrUpload = async (name, file) => {
    if (!file) return
    setUploadingQr((u) => ({ ...u, [name]: true }))
    try {
      const path = `paiement/${name}_${Date.now()}_${file.name}`
      const { error } = await supabase.storage.from('media').upload(path, file)
      if (error) throw error
      const url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl
      handleChange(name, url)
    } catch (err) {
      alert("Erreur lors de l'envoi du QR code : " + err.message)
    } finally {
      setUploadingQr((u) => ({ ...u, [name]: false }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { id, maj_le, ...payload } = form
      const { error } = await supabase.from('moyens_paiement').upsert({ id: 1, ...payload })
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
        Ces coordonnées s'affichent aux donateurs sur la page « Faire un don » selon le moyen de paiement choisi.
        Les paiements ne sont pas prélevés automatiquement : le donateur envoie les fonds à ces coordonnées, puis
        vous confirmez la réception manuellement dans l'onglet « Dons ».
      </p>
      <div className="space-y-3">
        {FIELDS.map((f, i) =>
          f.section ? (
            <p key={`s-${i}`} className="font-display uppercase font-bold text-xs text-cr-red pt-3 first:pt-0">{f.section}</p>
          ) : f.type === 'qr' ? (
            <div key={f.name}>
              <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">{f.label}</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-cr-red cursor-pointer w-fit">
                  <Upload size={14} /> {uploadingQr[f.name] ? 'Envoi...' : 'Téléverser un QR code'}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleQrUpload(f.name, e.target.files[0])} />
                </label>
                {form[f.name] && (
                  <img src={form[f.name]} alt="" className="h-16 w-16 object-contain border border-cr-dark/10 rounded-lg" />
                )}
              </div>
            </div>
          ) : (
            <div key={f.name}>
              <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={form[f.name] ?? ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red"
                />
              ) : (
                <input
                  type="text"
                  value={form[f.name] ?? ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red"
                />
              )}
            </div>
          )
        )}
      </div>
      <button onClick={handleSave} disabled={saving} className="btn-primary w-full mt-5 disabled:opacity-60">
        {saving ? 'Enregistrement...' : saved ? 'Enregistré ✓' : 'Enregistrer'}
      </button>
    </div>
  )
}