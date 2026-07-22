import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'

export default function LatestArticles() {
  const { data } = useSupabaseCollection('articles', { statut: 'publie', orderByField: 'date', orderDirection: 'desc' })

  if (!data.length) return null

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="eyebrow mb-2 block">Dernières nouvelles</span>
            <h2 className="section-title">Actualités</h2>
          </div>
          <Link to="/actualites" className="hidden md:inline text-sm font-bold uppercase text-cr-red">Toutes les actualités</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {data.slice(0, 3).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/actualites/${a.id}`} className="group block">
                <div className="h-52 rounded-2xl overflow-hidden mb-4">
                  <img src={a.image_url} alt={a.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="eyebrow">{a.categorie}</span>
                <h3 className="font-display uppercase font-bold text-lg mt-2 mb-1">{a.titre}</h3>
                <p className="text-sm text-cr-dark/60 line-clamp-2">{a.extrait}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
