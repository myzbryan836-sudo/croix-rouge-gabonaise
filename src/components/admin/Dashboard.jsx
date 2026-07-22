import { motion } from 'framer-motion'
import { Newspaper, Flag, Heart, HandHeart, Megaphone, AlertTriangle } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'

export default function Dashboard() {
  const { data: articles } = useSupabaseCollection('articles')
  const { data: missions } = useSupabaseCollection('missions')
  const { data: annonces } = useSupabaseCollection('annonces')
  const { data: dons } = useSupabaseCollection('dons')
  const { data: candidatures } = useSupabaseCollection('candidatures_benevoles')
  const { data: signalements } = useSupabaseCollection('signalements')

  const totalDons = dons.filter((d) => d.statut === 'complete').reduce((sum, d) => sum + Number(d.montant || 0), 0)
  const nouveauxSignalements = signalements.filter((s) => s.statut === 'nouveau').length

  const cards = [
    { label: 'Articles publiés', value: articles.filter((a) => a.statut === 'publie').length, icon: Newspaper },
    { label: 'Missions actives', value: missions.filter((m) => m.statut === 'publie').length, icon: Flag },
    { label: 'Annonces', value: annonces.length, icon: Megaphone },
    { label: 'Total dons complétés', value: `${totalDons.toLocaleString('fr-FR')} F`, icon: Heart },
    { label: 'Candidatures bénévoles', value: candidatures.length, icon: HandHeart },
    { label: 'Signalements nouveaux', value: nouveauxSignalements, icon: AlertTriangle },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="bg-white rounded-2xl p-6 shadow-sm">
          <c.icon className="text-cr-red mb-3" size={22} />
          <p className="font-display font-black text-2xl">{c.value}</p>
          <p className="text-xs uppercase tracking-wide text-cr-dark/50 mt-1">{c.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
