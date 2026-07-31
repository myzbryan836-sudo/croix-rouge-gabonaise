import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../../supabase/config'

const STORAGE_KEY = 'notif_last_seen'

const TYPE_LABELS = {
  article: 'Actualité',
  ressource: 'Ressource',
  annonce: 'Annonce',
}

const TYPE_LINKS = {
  article: '/actualites',
  ressource: '/nos-ressources',
  annonce: '/',
}

export default function NotificationBell({ light }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('cree_le', { ascending: false })
        .limit(30)
      setItems(data || [])
    }
    load()

    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setItems((prev) => [payload.new, ...prev].slice(0, 30))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const lastSeen = localStorage.getItem(STORAGE_KEY)
  const unreadCount = items.filter((n) => !lastSeen || new Date(n.cree_le) > new Date(lastSeen)).length

  const toggleOpen = () => {
    setOpen((o) => !o)
    if (!open) localStorage.setItem(STORAGE_KEY, new Date().toISOString())
  }

  const handleItemClick = () => {
    setOpen(false)
  }

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={toggleOpen} aria-label="Notifications" className={`relative p-2 rounded-full ${light ? 'text-white' : 'text-cr-dark'}`}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-cr-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl border border-cr-dark/5 py-2 z-50"
          >
            <p className="px-4 py-2 text-xs font-bold uppercase text-cr-dark/50">Notifications</p>
            {items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-cr-dark/40 text-center">Aucune notification pour le moment.</p>
            ) : (
              items.map((n) => (
                <Link
                  key={n.id}
                  to={TYPE_LINKS[n.type] || '/'}
                  onClick={handleItemClick}
                  className="block px-4 py-2.5 hover:bg-cr-gray transition-colors cursor-pointer"
                >
                  <p className="text-[11px] font-semibold text-cr-red uppercase">{TYPE_LABELS[n.type] || n.type}</p>
                  <p className="text-sm text-cr-dark">{n.titre}</p>
                  <p className="text-[11px] text-cr-dark/40 mt-0.5">{formatDate(n.cree_le)}</p>
                </Link>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}