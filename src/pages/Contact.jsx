import { useEffect, useState } from 'react'
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react'
import { supabase } from '../supabase/config'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const ITEMS = [
  { key: 'numero_vert', label: 'Numéro vert (urgence)', icon: Phone },
  { key: 'whatsapp', label: 'WhatsApp officiel', icon: MessageCircle },
  { key: 'email', label: 'Email officiel', icon: Mail },
  { key: 'adresse', label: 'Adresse', icon: MapPin },
  { key: 'horaires', label: 'Horaires', icon: Clock },
]

export default function Contact() {
  const [infos, setInfos] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('contact_infos').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      setInfos(data)
      setLoading(false)
    })
  }, [])

  const hasMap = infos?.gps_lat && infos?.gps_lng

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">Nous contacter</span>
        <h1 className="section-title mb-4">Contact</h1>
        <p className="text-cr-dark/60 max-w-2xl mb-12">
          Une urgence, une question, un partenariat ? Voici les moyens officiels pour joindre la Croix-Rouge Gabonaise.
        </p>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {ITEMS.map(({ key, label, icon: Icon }) => (
              <div key={key} className="bg-white rounded-2xl p-6 shadow-sm border border-cr-dark/5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-cr-red/10 text-cr-red flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold text-cr-dark/50 mb-1">{label}</p>
                  <p className="font-semibold text-cr-dark">{infos?.[key] || 'Information en cours de mise à jour'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMap && (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-cr-dark/5 h-80">
            <iframe
              title="Localisation"
              className="w-full h-full"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${infos.gps_lng - 0.02}%2C${infos.gps_lat - 0.02}%2C${infos.gps_lng + 0.02}%2C${infos.gps_lat + 0.02}&layer=mapnik&marker=${infos.gps_lat}%2C${infos.gps_lng}`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
