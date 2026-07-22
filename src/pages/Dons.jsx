import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, CreditCard, Smartphone, Heart, Copy, Check } from 'lucide-react'
import { supabase } from '../supabase/config'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'

const AMOUNTS = [5000, 10000, 25000, 50000]
const METHODS = [
  { value: 'carte', label: 'Carte bancaire', icon: CreditCard },
  { value: 'moov_money', label: 'Moov Money', icon: Smartphone },
  { value: 'airtel_money', label: 'Airtel Money', icon: Smartphone },
]

function CopyLine({ label, value }) {
  const [copied, setCopied] = useState(false)
  if (!value) return null
  const handleCopy = () => {
    navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div>
        <p className="text-[11px] uppercase font-semibold text-cr-dark/40">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
      <button type="button" onClick={handleCopy} className="p-1.5 rounded hover:bg-cr-gray text-cr-dark/60 shrink-0">
        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
      </button>
    </div>
  )
}

export default function Dons() {
  const [params] = useSearchParams()
  const initialAmount = Number(params.get('montant')) || 10000
  const { data: paiementRows } = useSupabaseCollection('moyens_paiement')
  const paiement = paiementRows[0] || {}

  const [amount, setAmount] = useState(initialAmount)
  const [custom, setCustom] = useState('')
  const [type, setType] = useState('ponctuel')
  const [method, setMethod] = useState('carte')
  const [form, setForm] = useState({ nom: '', email: '', telephone: '' })
  const [step, setStep] = useState(1)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const finalAmount = custom ? Number(custom) : amount

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      // NOTE: l'intégration réelle des paiements (Stripe PaymentIntent, Moov Money,
      // Airtel Money) doit être effectuée via une fonction serveur sécurisée
      // (ex. Supabase Edge Function). Ici, la demande de don est enregistrée en
      // `en_attente`, puis mise à jour par le webhook du fournisseur de paiement.
      const { error: insertError } = await supabase.from('dons').insert({
        montant: finalAmount,
        type,
        methode: method,
        nom_donateur: form.nom,
        email_donateur: form.email,
        telephone_donateur: form.telephone,
        statut: 'en_attente',
      })
      if (insertError) throw insertError
      setStep(3)
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">Soutenir la Croix-Rouge Gabonaise</span>
        <h1 className="section-title mb-4">Faire un don</h1>
        <p className="text-cr-dark/60 mb-10">
          Chaque don, quel que soit son montant, contribue directement à nos actions d'urgence, de santé et d'accompagnement social.
        </p>

        <AnimatePresence mode="wait">
          {step === 3 ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <CheckCircle2 className="mx-auto text-green-600 mb-4" size={56} />
              <h2 className="font-display uppercase font-extrabold text-2xl mb-2">Merci pour votre générosité !</h2>
              <p className="text-cr-dark/60">
                Votre demande de don de {finalAmount.toLocaleString('fr-FR')} FCFA a été enregistrée. Vous recevrez un email de confirmation une fois le paiement finalisé.
              </p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-6">

              <div>
                <p className="font-semibold text-sm mb-3">Type de don</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ v: 'ponctuel', l: 'Ponctuel' }, { v: 'mensuel', l: 'Mensuel' }].map((t) => (
                    <button type="button" key={t.v} onClick={() => setType(t.v)}
                      className={`py-2.5 rounded-lg text-sm font-semibold border ${type === t.v ? 'bg-cr-red text-white border-cr-red' : 'border-cr-dark/15'}`}>
                      {t.l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-3">Montant (FCFA)</p>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {AMOUNTS.map((a) => (
                    <button type="button" key={a} onClick={() => { setAmount(a); setCustom('') }}
                      className={`py-2.5 rounded-lg text-xs font-semibold border ${!custom && amount === a ? 'bg-cr-red text-white border-cr-red' : 'border-cr-dark/15'}`}>
                      {a.toLocaleString('fr-FR')}
                    </button>
                  ))}
                </div>
                <input type="number" placeholder="Montant personnalisé" value={custom} onChange={(e) => setCustom(e.target.value)}
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
              </div>

              <div>
                <p className="font-semibold text-sm mb-3">Vos informations</p>
                <div className="space-y-2">
                  <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom complet"
                    className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email"
                    className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                  <input name="telephone" value={form.telephone} onChange={handleChange} required placeholder="Téléphone"
                    className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-3">Moyen de paiement</p>
                <div className="grid grid-cols-3 gap-2">
                  {METHODS.map((m) => (
                    <button type="button" key={m.value} onClick={() => setMethod(m.value)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-lg text-xs font-semibold border ${method === m.value ? 'bg-cr-red text-white border-cr-red' : 'border-cr-dark/15'}`}>
                      <m.icon size={18} /> {m.label}
                    </button>
                  ))}
                </div>

                {method === 'moov_money' && (paiement.moov_money_numero || paiement.moov_money_titulaire) && (
                  <div className="mt-3 bg-cr-gray rounded-lg px-4 py-2 divide-y divide-cr-dark/10">
                    <CopyLine label="Numéro Moov Money" value={paiement.moov_money_numero} />
                    <CopyLine label="Titulaire" value={paiement.moov_money_titulaire} />
                    <p className="text-xs text-cr-dark/50 pt-2">Envoyez le montant à ce numéro puis confirmez ci-dessous. Notre équipe validera la réception.</p>
                  </div>
                )}

                {method === 'airtel_money' && (paiement.airtel_money_numero || paiement.airtel_money_titulaire) && (
                  <div className="mt-3 bg-cr-gray rounded-lg px-4 py-2 divide-y divide-cr-dark/10">
                    <CopyLine label="Numéro Airtel Money" value={paiement.airtel_money_numero} />
                    <CopyLine label="Titulaire" value={paiement.airtel_money_titulaire} />
                    <p className="text-xs text-cr-dark/50 pt-2">Envoyez le montant à ce numéro puis confirmez ci-dessous. Notre équipe validera la réception.</p>
                  </div>
                )}

                {method === 'carte' && (
                  <div className="mt-3 bg-cr-gray rounded-lg px-4 py-2 divide-y divide-cr-dark/10">
                    <CopyLine label="Banque" value={paiement.banque_nom} />
                    <CopyLine label="Titulaire du compte" value={paiement.banque_titulaire} />
                    <CopyLine label="Numéro de compte" value={paiement.banque_numero_compte} />
                    <CopyLine label="IBAN" value={paiement.banque_iban} />
                    <p className="text-xs text-cr-dark/50 pt-2">
                      {paiement.instructions_carte || "Réglez ce don par carte ou virement vers ce compte depuis votre banque, puis confirmez ci-dessous. Notre équipe validera la réception."}
                    </p>
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-cr-red">{error}</p>}

              <button type="submit" disabled={sending || !finalAmount} className="btn-primary w-full disabled:opacity-60">
                {sending ? 'Traitement...' : <>Confirmer le don de {finalAmount ? finalAmount.toLocaleString('fr-FR') : 0} FCFA <Heart size={16} /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
