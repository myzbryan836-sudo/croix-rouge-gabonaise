import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'

const AMOUNTS = [5000, 10000, 25000]
const DEFAULT_BG = 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=1974&auto=format&fit=crop'

export default function Hero() {
  const [amount, setAmount] = useState(10000)
  const [custom, setCustom] = useState('')
  const { data: contenus, loading } = useSupabaseCollection('contenus')

  const selected = custom ? Number(custom) : amount
  const customBg = contenus.find((c) => c.cle === 'hero_background_image')?.valeur
  // Tant que le contenu n'a pas fini de charger, on n'affiche aucune image de
  // secours : ça évite qu'une ancienne image (ou l'image par défaut) apparaisse
  // une fraction de seconde avant que la bonne image ne s'affiche.
  const heroBg = customBg || (loading ? null : DEFAULT_BG)

  return (
    <section className="relative min-h-screen flex items-end pb-20 md:pb-28 overflow-hidden bg-cr-dark">
      {heroBg && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: `url('${heroBg}')`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-cr-dark via-cr-dark/60 to-cr-dark/20" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 w-full grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow text-white/90 mb-4 block">Croix-Rouge Gabonaise</span>
          <h1 className="font-display uppercase font-black text-white text-4xl sm:text-5xl md:text-7xl leading-[0.95] tracking-tight mb-6">
            Chaque geste<br />sauve une vie
          </h1>
          <p className="text-white/80 max-w-md text-base md:text-lg mb-8">
            Urgences, santé, action sociale et formation : à travers tout le Gabon, nos équipes et bénévoles agissent chaque jour aux côtés des communautés vulnérables.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/dons" className="btn-primary">Faire un don <Heart size={16} /></Link>
            <Link to="/missions" className="btn-outline-light">Découvrir nos missions <ArrowRight size={16} /></Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl w-full"
        >
          <p className="font-display uppercase font-extrabold text-lg mb-1">Don rapide</p>
          <p className="text-sm text-cr-dark/60 mb-5">Votre soutien agit immédiatement sur le terrain.</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => { setAmount(a); setCustom('') }}
                className={`py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  !custom && amount === a
                    ? 'bg-cr-red text-white border-cr-red'
                    : 'border-cr-dark/15 text-cr-dark hover:border-cr-red'
                }`}
              >
                {a.toLocaleString('fr-FR')} F
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Montant personnalisé (FCFA)"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="w-full border border-cr-dark/15 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-cr-red"
          />
          <Link
            to={`/dons?montant=${selected}`}
            className="btn-primary w-full"
          >
            Donner {selected ? `${Number(selected).toLocaleString('fr-FR')} F` : ''} <Heart size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
