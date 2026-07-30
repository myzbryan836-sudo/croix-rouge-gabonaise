import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import { supabase } from '../../supabase/config'

const STORAGE_KEY = 'notif_toast_last_shown'

const TYPE_LABELS = {
  article: 'Nouvelle actualité',
  ressource: 'Nouvelle ressource',
  annonce: 'Nouvelle annonce',
}

const TYPE_LINKS = {
  article: '/actualites',
  ressource: '/nos-ressources',
  annonce: '/',
}

export default function NotificationToast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const checkLatest = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('cree_le', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!data) return
      const lastShown = localStorage.getItem(STORAGE_KEY)
      if (!lastShown || new Date(data.cree_le) > new Date(lastShown)) {
        setToast(data)
      }
    }
    checkLatest()

    const channel = supabase
      .channel('notifications-toast')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setToast(payload.new)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => dismiss(), 8000)
    return () => clearTimeout(timer)
  }, [toast])

  const dismiss = () => {
    if (toast) localStorage.setItem(STORAGE_KEY, toast.cree_le)
    setToast(null)
  }

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-5 left-5 z-[95] max-w-sm bg-white rounded-xl shadow-xl border border-cr-dark/10 p-4 flex gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Bell className="text-cr-red" size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase text-cr-red">{TYPE_LABELS[toast.type] || 'Nouvelle publication'}</p>
            <p className="text-sm text-cr-dark mt-0.5">{toast.titre}</p>
            <Link
              to={TYPE_LINKS[toast.type] || '/'}
              onClick={dismiss}
              className="text-xs font-semibold text-cr-red mt-1.5 inline-block hover:underline"
            >
              Voir
            </Link>
          </div>
          <button onClick={dismiss} className="text-cr-dark/40 hover:text-cr-dark shrink-0" aria-label="Fermer">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}