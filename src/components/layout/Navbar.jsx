import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart, User, ChevronDown } from 'lucide-react'
import Logo from '../shared/Logo'
import { useAuth } from '../../context/AuthContext'

const MENU = [
  { to: '/', label: 'Accueil' },
  { to: '/actualites', label: 'Actualités' },
  {
    label: 'Notre travail',
    children: [
      { to: '/carte-interventions', label: 'Carte de nos interventions' },
      { to: '/missions?categorie=urgence', label: 'Urgence et secours' },
      { to: '/missions?categorie=sante', label: 'Santé communautaire' },
      { to: '/missions?categorie=social', label: 'Aide humanitaire' },
      { to: '/missions?categorie=prevention', label: 'Prévention' },
      { to: '/missions?categorie=formation', label: 'Formation' },
    ],
  },
  {
    label: 'Qui sommes-nous ?',
    children: [
      { to: '/qui-sommes-nous#histoire', label: 'Notre histoire' },
      { to: '/qui-sommes-nous#mission', label: 'Notre mission' },
      { to: '/qui-sommes-nous#vision', label: 'Notre vision' },
      { to: '/qui-sommes-nous#valeurs', label: 'Nos valeurs' },
      { to: '/qui-sommes-nous#promesse', label: 'Notre promesse' },
      { to: '/qui-sommes-nous#organisation', label: 'Notre organisation' },
    ],
  },
  {
    label: 'Nos ressources',
    children: [
      { to: '/nos-ressources?categorie=rapport', label: 'Rapports' },
      { to: '/nos-ressources?categorie=publication', label: 'Publications' },
      { to: '/nos-ressources?categorie=document_officiel', label: 'Documents officiels' },
      { to: '/nos-ressources?categorie=photo', label: 'Photos' },
      { to: '/nos-ressources?categorie=video', label: 'Vidéos' },
    ],
  },
  { to: '/partenaires', label: 'Nos partenaires' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/benevoles', label: 'Bénévolat' },
  { to: '/contact', label: 'Contact' },
]

function DesktopDropdown({ item, light }) {
  const [open, setOpen] = useState(false)
  const closeTimeout = useRef(null)

  const handleEnter = () => {
    clearTimeout(closeTimeout.current)
    setOpen(true)
  }
  const handleLeave = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 text-sm font-semibold uppercase tracking-wide transition-colors opacity-80 hover:opacity-100 ${
          light ? 'text-white' : 'text-cr-dark'
        }`}
      >
        {item.label} <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-cr-dark/5 py-2 z-50"
          >
            {item.children.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className="block px-4 py-2.5 text-sm text-cr-dark/80 hover:bg-cr-gray hover:text-cr-red transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileAccordion({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-cr-dark font-semibold uppercase tracking-wide py-1"
      >
        {item.label} <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-3"
          >
            <div className="flex flex-col gap-2.5 py-2">
              {item.children.map((c) => (
                <Link key={c.label} to={c.to} className="text-sm text-cr-dark/70">
                  {c.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAdmin } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const isHome = location.pathname === '/'
  const light = isHome && !scrolled

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        light ? 'bg-transparent' : 'bg-cr-cream/95 backdrop-blur shadow-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        <Link to="/"><Logo light={light} /></Link>

        <div className="hidden lg:flex items-center gap-7">
          {MENU.map((item) =>
            item.children ? (
              <DesktopDropdown key={item.label} item={item} light={light} />
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase tracking-wide transition-colors ${
                    light ? 'text-white' : 'text-cr-dark'
                  } ${isActive ? 'opacity-100 border-b-2 border-cr-red pb-1' : 'opacity-80 hover:opacity-100'}`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link to={isAdmin ? '/admin' : user ? '/' : '/connexion'} className={`p-2 rounded-full ${light ? 'text-white' : 'text-cr-dark'}`}>
            <User size={20} />
          </Link>
          <Link to="/dons" className="btn-primary">
            <Heart size={16} /> Faire un don
          </Link>
        </div>

        <button className={`lg:hidden ${light ? 'text-white' : 'text-cr-dark'}`} onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-cr-cream overflow-hidden shadow-lg max-h-[75vh] overflow-y-auto"
          >
            <div className="flex flex-col px-6 py-4 gap-3">
              {MENU.map((item) =>
                item.children ? (
                  <MobileAccordion key={item.label} item={item} />
                ) : (
                  <NavLink key={item.to} to={item.to} className="text-cr-dark font-semibold uppercase tracking-wide py-1">
                    {item.label}
                  </NavLink>
                )
              )}
              <Link to={isAdmin ? '/admin' : user ? '/' : '/connexion'} className="text-cr-dark font-semibold uppercase tracking-wide py-1">
                {user ? (isAdmin ? 'Espace admin' : 'Mon compte') : 'Connexion'}
              </Link>
              <Link to="/dons" className="btn-primary w-full">
                <Heart size={16} /> Faire un don
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
