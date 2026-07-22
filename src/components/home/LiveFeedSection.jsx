import { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Share2, X } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'

const BADGE_LABELS = {
  mission: 'Mission',
  article: 'Actualité',
  annonce: 'Annonce',
}

function toDate(d) {
  if (!d) return new Date()
  return d.toDate ? d.toDate() : new Date(d)
}

export default function LiveFeedSection() {
  const scrollRef = useRef(null)
  const [selectedAnnonce, setSelectedAnnonce] = useState(null)
  const { data: missions } = useSupabaseCollection('missions', { statut: 'publie' })
  const { data: articles } = useSupabaseCollection('articles', { statut: 'publie' })
  const { data: annonces } = useSupabaseCollection('annonces', { statut: 'publie' })

  const items = useMemo(() => {
    const all = [
      ...missions.map((m) => ({ ...m, _type: 'mission', _date: toDate(m.date || m.cree_le) })),
      ...articles.map((a) => ({ ...a, _type: 'article', _date: toDate(a.date || a.cree_le) })),
      ...annonces.map((a) => ({ ...a, _type: 'annonce', _date: toDate(a.date || a.cree_le) })),
    ]
    return all.sort((a, b) => b._date - a._date).slice(0, 9)
  }, [missions, articles, annonces])

  const hrefFor = (item) => {
    if (item._type === 'mission') return `/missions#mission-${item.id}`
    if (item._type === 'article') return `/actualites/${item.id}`
    return null // annonce : ouverte dans une fenêtre de détail, pas un lien
  }

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  const share = async (item) => {
    const url = window.location.origin + (hrefFor(item) || '/')
    if (navigator.share) {
      try { await navigator.share({ title: item.titre, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  if (!items.length) return null

  return (
    <section className="bg-cr-gray py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="eyebrow mb-2 block">En direct</span>
            <h2 className="section-title">Sur le terrain</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll(-1)} className="w-11 h-11 rounded-full border border-cr-dark/15 flex items-center justify-center hover:bg-white">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll(1)} className="w-11 h-11 rounded-full border border-cr-dark/15 flex items-center justify-center hover:bg-white">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((item, i) => (
            <motion.div
              key={`${item._type}-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="snap-start shrink-0 w-[300px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=800'}
                  alt={item.titre}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-cr-red text-white text-[11px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-full">
                  {BADGE_LABELS[item._type]}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs text-cr-dark/50 mb-1">
                  {item._date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </p>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.titre}</h3>
                <p className="text-xs text-cr-dark/60 line-clamp-2 mb-3">{item.description || item.extrait}</p>
                <div className="flex items-center justify-between">
                  {item._type === 'annonce' ? (
                    <button onClick={() => setSelectedAnnonce(item)} className="text-xs font-bold uppercase tracking-wide text-cr-red">
                      Lire la suite
                    </button>
                  ) : (
                    <Link to={hrefFor(item)} className="text-xs font-bold uppercase tracking-wide text-cr-red">
                      Lire la suite
                    </Link>
                  )}
                  <button onClick={() => share(item)} className="text-cr-dark/40 hover:text-cr-red">
                    <Share2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedAnnonce && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedAnnonce(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl overflow-hidden max-w-lg w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedAnnonce.image_url || 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=800'}
                  alt={selectedAnnonce.titre}
                  className="w-full h-56 object-cover"
                />
                <button onClick={() => setSelectedAnnonce(null)} className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-xs text-cr-dark/50 mb-2">
                  {selectedAnnonce._date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h3 className="font-display uppercase font-bold text-lg mb-3">{selectedAnnonce.titre}</h3>
                <p className="text-sm text-cr-dark/70 whitespace-pre-line">{selectedAnnonce.description}</p>
                {selectedAnnonce.lien && (
                  <a href={selectedAnnonce.lien} target="_blank" rel="noreferrer"
                    className="btn-primary w-full mt-5 inline-flex justify-center">
                    En savoir plus
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
