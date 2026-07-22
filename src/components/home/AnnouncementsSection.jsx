import { motion } from 'framer-motion'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'

export default function AnnouncementsSection() {
  const { data } = useSupabaseCollection('annonces', { statut: 'publie', orderByField: 'ordre', orderDirection: 'asc' })
  const banners = data.filter((a) => a.type === 'banniere' || a.type === 'publicite')

  if (!banners.length) return null

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-4">
        {banners.slice(0, 2).map((b, i) => (
          <motion.a
            key={b.id}
            href={b.lien || '#'}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative rounded-2xl overflow-hidden h-40 group"
          >
            <img src={b.image_url} alt={b.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-cr-dark/40 flex items-end p-5">
              <p className="text-white font-display uppercase font-bold text-lg">{b.titre}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
