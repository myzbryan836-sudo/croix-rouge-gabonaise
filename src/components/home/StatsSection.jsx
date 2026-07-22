import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.floor(v)),
    })
    return controls.stop
  }, [inView, value])

  return (
    <span ref={ref} className="font-display font-black text-4xl md:text-6xl text-white">
      {display.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}

const FALLBACK = [
  { label: 'Personnes secourues', valeur: 120000, suffixe: '+', ordre: 1 },
  { label: 'Bénévoles actifs', valeur: 3500, suffixe: '+', ordre: 2 },
  { label: 'Provinces couvertes', valeur: 9, suffixe: '', ordre: 3 },
  { label: "Années d'engagement", valeur: 60, suffixe: '+', ordre: 4 },
]

export default function StatsSection() {
  const { data } = useSupabaseCollection('statistiques_impact', { orderByField: 'ordre', orderDirection: 'asc' })
  const stats = data.length ? data : FALLBACK

  return (
    <section className="bg-cr-dark py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.id || s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Counter value={Number(s.valeur)} suffix={s.suffixe || ''} />
              <p className="text-white/60 text-xs md:text-sm uppercase tracking-widest mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
