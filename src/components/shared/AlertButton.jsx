import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import AlertModal from './AlertModal'

export default function AlertButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="fixed bottom-6 right-6 z-50 bg-cr-red text-white rounded-full pl-4 pr-5 py-3.5 shadow-xl flex items-center gap-2 font-semibold text-sm uppercase tracking-wide"
      >
        <AlertTriangle size={18} />
        Cri d'alerte
      </motion.button>
      <AlertModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
