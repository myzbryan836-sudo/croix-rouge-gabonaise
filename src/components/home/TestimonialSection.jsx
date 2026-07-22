import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'

export default function TestimonialSection() {
  const { data } = useSupabaseCollection('contenus')
  const t = data.find((c) => c.cle === 'temoignage_benevole')

  const nom = t?.titre || 'Aïsha N.'
  const citation = t?.valeur || "Devenir bénévole à la Croix-Rouge Gabonaise a changé ma façon de voir la solidarité. Chaque intervention nous rapproche un peu plus des communautés que nous servons."

  return (
    <section className="bg-cr-gray py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Quote className="mx-auto text-cr-red mb-6" size={36} />
          <p className="font-display text-xl md:text-3xl font-medium leading-snug mb-6">"{citation}"</p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-cr-red/10 flex items-center justify-center font-display font-bold text-cr-red">
              {nom.charAt(0)}
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">{nom}</p>
              <p className="text-xs text-cr-dark/50 uppercase tracking-wide">Bénévole terrain</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
