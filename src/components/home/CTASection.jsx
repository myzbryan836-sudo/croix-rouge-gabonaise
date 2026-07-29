import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, HandHeart } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-cr-cream">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-cr-red rounded-2xl p-8 md:p-10 text-white flex flex-col justify-between min-h-[260px]"
        >
          <div>
            <Heart size={28} className="mb-4" />
            <h3 className="font-display uppercase font-extrabold text-2xl mb-3">Faire un don</h3>
            <p className="text-white/85 text-sm">Votre contribution finance directement nos interventions d'urgence et nos programmes de santé.</p>
          </div>
          <Link to="/dons" className="btn-outline-light mt-6 self-start">Donner maintenant</Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-cr-dark rounded-2xl p-8 md:p-10 text-white flex flex-col justify-between min-h-[260px]"
        >
          <div>
            <HandHeart size={28} className="mb-4" />
            <h3 className="font-display uppercase font-extrabold text-2xl mb-3">Devenir bénévole</h3>
            <p className="text-white/70 text-sm">Rejoignez un réseau de milliers de bénévoles engagés partout au Gabon.</p>
          </div>
          <Link to="/benevoles" className="btn-outline-light mt-6 self-start">Je m'engage</Link>
        </motion.div>
      </div>
    </section>
  )
}
