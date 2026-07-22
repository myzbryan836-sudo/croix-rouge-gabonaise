import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Handshake } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'

export default function PartnersSection() {
  const { data } = useSupabaseCollection('partenaires', { statut: 'publie', orderByField: 'ordre', orderDirection: 'asc' })

  if (!data.length) return null

  return (
    <section className="py-16 md:py-24 bg-cr-gray">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="eyebrow mb-2 block">Ils nous soutiennent</span>
            <h2 className="section-title">Nos partenaires</h2>
          </div>
          <Link to="/partenaires" className="text-sm font-semibold uppercase text-cr-red hover:underline hidden md:block">
            Voir tous les partenaires
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.slice(0, 12).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-xl h-24 flex items-center justify-center p-4 shadow-sm"
            >
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.nom} className="max-h-12 max-w-full object-contain" />
              ) : (
                <Handshake className="text-cr-red" size={22} />
              )}
            </motion.div>
          ))}
        </div>

        <Link to="/partenaires" className="text-sm font-semibold uppercase text-cr-red hover:underline mt-6 inline-block md:hidden">
          Voir tous les partenaires
        </Link>
      </div>
    </section>
  )
}
