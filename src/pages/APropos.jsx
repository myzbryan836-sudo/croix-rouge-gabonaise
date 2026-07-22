import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const SECTIONS = [
  { cle: 'histoire', titre: 'Notre histoire' },
  { cle: 'mission', titre: 'Notre mission' },
  { cle: 'vision', titre: 'Notre vision' },
  { cle: 'valeurs', titre: 'Nos valeurs' },
  { cle: 'promesse', titre: 'Notre promesse' },
  { cle: 'organisation', titre: 'Notre organisation' },
]

export default function APropos() {
  const { data, loading } = useSupabaseCollection('contenus')
  const location = useLocation()

  useEffect(() => {
    if (!loading && location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [loading, location.hash])

  const getContenu = (cle) => data.find((c) => c.cle === cle)?.valeur

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">La Croix-Rouge Gabonaise</span>
        <h1 className="section-title mb-12">Qui sommes-nous ?</h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-14">
            {SECTIONS.map((s) => (
              <section key={s.cle} id={s.cle} className="scroll-mt-28">
                <h2 className="font-display uppercase font-extrabold text-2xl mb-3 text-cr-red">{s.titre}</h2>
                <p className="text-cr-dark/70 leading-relaxed whitespace-pre-line">
                  {getContenu(s.cle) || 'Information en cours de mise à jour.'}
                </p>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
