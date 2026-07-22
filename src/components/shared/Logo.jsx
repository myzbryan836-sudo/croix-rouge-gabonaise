import { motion } from 'framer-motion'

export default function Logo({ light = false, className = '' }) {
  return (
    <motion.img
      src="/logo-croix-rouge-gabonaise.png"
      alt="Croix-Rouge Gabonaise"
      whileHover={{ rotate: 10 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={`h-14 w-14 rounded-full object-contain ${light ? 'shadow-[0_0_0_2px_rgba(255,255,255,0.15)]' : ''} ${className}`}
    />
  )
}
