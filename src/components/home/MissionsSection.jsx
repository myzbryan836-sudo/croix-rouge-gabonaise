import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AlertTriangle, HeartPulse, Users, GraduationCap, ArrowRight } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'

const ICONS = { urgence: AlertTriangle, sante: HeartPulse, social: Users, formation: GraduationCap }

export default function MissionsSection() {
  const { data } = useSupabaseCollection('missions', { statut: 'publie', orderByField: 'ordre', orderDirection: 'asc' })

  return (
    <section className="bg-cr-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="eyebrow mb-2 block">Nos actions</span>
            <h2 className="section-title">Missions prioritaires</h2>
          </div>
          <Link to="/missions" className="hidden md:inline-flex items-center gap-1 text-sm font-bold uppercase text-cr-red">
            Tout voir <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.slice(0, 4).map((m, i) => {
            const Icon = ICONS[m.icone] || Users
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/missions#mission-${m.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group block h-full"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img src={m.image_url} alt={m.titre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-white/90 text-cr-red text-[11px] font-bold uppercase px-2.5 py-1 rounded-full">
                      {m.badge}
                    </span>
                  </div>
                  <div className="p-5">
                    <Icon className="text-cr-red mb-3" size={22} />
                    <h3 className="font-display uppercase font-bold text-base mb-2">{m.titre}</h3>
                    <p className="text-sm text-cr-dark/60 line-clamp-3">{m.description}</p>
                    <span className="inline-block mt-3 text-xs font-bold uppercase text-cr-red">Lire les détails</span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
