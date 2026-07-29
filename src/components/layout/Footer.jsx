import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Music2, Phone, Mail, MapPin } from 'lucide-react'
import Logo from '../shared/Logo'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import { supabase } from '../../supabase/config'

const SOCIAL_ICONS = {
  Facebook: Facebook,
  Instagram: Instagram,
  TikTok: Music2,
  YouTube: Youtube,
  LinkedIn: Linkedin,
  'X (Twitter)': Twitter,
}

export default function Footer() {
  const { data: reseaux } = useSupabaseCollection('reseaux_sociaux', { orderByField: 'ordre', orderDirection: 'asc' })
  const [contact, setContact] = useState(null)

  useEffect(() => {
    supabase.from('contact_infos').select('*').eq('id', 1).maybeSingle().then(({ data }) => setContact(data))
  }, [])

  const actifs = reseaux.filter((r) => r.actif === true || r.actif === 'true')

  return (
    <footer className="bg-cr-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-4 gap-10">
        <div>
          <Logo light />
          <p className="text-sm text-white/60 mt-4 leading-relaxed">
            Mouvement humanitaire national œuvrant pour secourir, soigner, former et accompagner les communautés vulnérables partout au Gabon.
          </p>
          <div className="flex gap-3 mt-5">
            {actifs.length > 0 ? (
              actifs.map((r) => {
                const Icon = SOCIAL_ICONS[r.plateforme] || Facebook
                return (
                  <a key={r.id} href={r.url || '#'} target="_blank" rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-cr-red transition-colors">
                    <Icon size={16} />
                  </a>
                )
              })
            ) : (
              [Facebook, Twitter, Instagram].map((Icon, i) => (
                <span key={i} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center opacity-40">
                  <Icon size={16} />
                </span>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/missions" className="hover:text-white">Nos missions</Link></li>
            <li><Link to="/qui-sommes-nous" className="hover:text-white">Qui sommes-nous</Link></li>
            <li><Link to="/actualites" className="hover:text-white">Actualités</Link></li>
            <li><Link to="/nos-ressources" className="hover:text-white">Nos ressources</Link></li>
            <li><Link to="/benevoles" className="hover:text-white">Devenir bénévole</Link></li>
            <li><Link to="/dons" className="hover:text-white">Faire un don</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2"><Phone size={15} /> {contact?.numero_vert || 'Information en cours de mise à jour'}</li>
            <li className="flex items-center gap-2"><Mail size={15} /> {contact?.email || 'Information en cours de mise à jour'}</li>
            <li className="flex items-center gap-2"><MapPin size={15} /> {contact?.adresse || 'Information en cours de mise à jour'}</li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Paiements acceptés</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {['Moov Money', 'Airtel Money', 'Visa', 'Mastercard'].map((p) => (
              <span key={p} className="px-3 py-1.5 rounded-full bg-white/10 text-white/80">{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 mt-12 pt-6 border-t border-white/10 text-xs text-white/40 flex flex-col md:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} Croix-Rouge Gabonaise. Tous droits réservés.</span>
        <span>Membre du Mouvement international de la Croix-Rouge et du Croissant-Rouge</span>
      </div>
    </footer>
  )
}
