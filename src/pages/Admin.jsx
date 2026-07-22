import { useState } from 'react'
import { LayoutDashboard, Newspaper, Flag, Megaphone, FileText, Heart, HandHeart, AlertTriangle, LogOut, Share2, Phone, BookOpen, Handshake, Images, MapPinned, Info, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '../components/shared/Logo'
import { useAuth } from '../context/AuthContext'
import Dashboard from '../components/admin/Dashboard'
import ArticlesTab from '../components/admin/ArticlesTab'
import MissionsTab from '../components/admin/MissionsTab'
import AnnoncesTab from '../components/admin/AnnoncesTab'
import ContenusTab from '../components/admin/ContenusTab'
import DonsTab from '../components/admin/DonsTab'
import CandidaturesTab from '../components/admin/CandidaturesTab'
import SignalementsTab from '../components/admin/SignalementsTab'
import RessourcesTab from '../components/admin/RessourcesTab'
import ReseauxSociauxTab from '../components/admin/ReseauxSociauxTab'
import ContactTab from '../components/admin/ContactTab'
import PaiementTab from '../components/admin/PaiementTab'
import PartenairesTab from '../components/admin/PartenairesTab'
import GalerieTab from '../components/admin/GalerieTab'
import ZonesInterventionTab from '../components/admin/ZonesInterventionTab'
import AProposTab from '../components/admin/AProposTab'

const TABS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, Comp: Dashboard },
  { key: 'articles', label: 'Articles', icon: Newspaper, Comp: ArticlesTab },
  { key: 'missions', label: 'Missions', icon: Flag, Comp: MissionsTab },
  { key: 'zones', label: 'Zones d\u2019intervention', icon: MapPinned, Comp: ZonesInterventionTab },
  { key: 'annonces', label: 'Annonces', icon: Megaphone, Comp: AnnoncesTab },
  { key: 'partenaires', label: 'Partenaires', icon: Handshake, Comp: PartenairesTab },
  { key: 'galerie', label: 'Galerie', icon: Images, Comp: GalerieTab },
  { key: 'ressources', label: 'Ressources', icon: BookOpen, Comp: RessourcesTab },
  { key: 'apropos', label: 'Qui sommes-nous', icon: Info, Comp: AProposTab },
  { key: 'contenus', label: 'Contenus', icon: FileText, Comp: ContenusTab },
  { key: 'reseaux', label: 'Réseaux sociaux', icon: Share2, Comp: ReseauxSociauxTab },
  { key: 'contact', label: 'Contact', icon: Phone, Comp: ContactTab },
  { key: 'paiement', label: 'Moyens de paiement', icon: Wallet, Comp: PaiementTab },
  { key: 'dons', label: 'Dons', icon: Heart, Comp: DonsTab },
  { key: 'candidatures', label: 'Candidatures', icon: HandHeart, Comp: CandidaturesTab },
  { key: 'signalements', label: 'Signalements', icon: AlertTriangle, Comp: SignalementsTab },
]

export default function Admin() {
  const [active, setActive] = useState('dashboard')
  const { logout } = useAuth()
  const ActiveComp = TABS.find((t) => t.key === active)?.Comp || Dashboard

  return (
    <div className="min-h-screen flex bg-cr-gray">
      <aside className="w-64 bg-cr-dark text-white shrink-0 hidden md:flex flex-col p-5">
        <Link to="/" className="mb-8"><Logo light /></Link>
        <nav className="flex-1 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === t.key ? 'bg-cr-red text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <t.icon size={17} /> {t.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 mt-4">
          <LogOut size={17} /> Déconnexion
        </button>
      </aside>

      <main className="flex-1 p-5 md:p-10 overflow-x-hidden">
        <div className="md:hidden flex gap-2 overflow-x-auto mb-6 pb-2">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setActive(t.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${active === t.key ? 'bg-cr-red text-white' : 'bg-white text-cr-dark/70'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <h1 className="font-display uppercase font-extrabold text-2xl mb-6">{TABS.find((t) => t.key === active)?.label}</h1>
        <ActiveComp />
      </main>
    </div>
  )
}
