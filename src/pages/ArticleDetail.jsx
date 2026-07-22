import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Share2, Link as LinkIcon } from 'lucide-react'
import { supabase } from '../supabase/config'
import LoadingSpinner from '../components/shared/LoadingSpinner'

function toDate(d) {
  if (!d) return new Date()
  return d.toDate ? d.toDate() : new Date(d)
}

export default function ArticleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase.from('articles').select('*').eq('id', id).single()
      setArticle(data || null)
      setLoading(false)
    }
    load()
  }, [id])

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: article.titre, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return <LoadingSpinner full />
  if (!article) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-cr-dark/60 mb-4">Article introuvable.</p>
        <Link to="/actualites" className="btn-outline">Retour aux actualités</Link>
      </div>
    )
  }

  return (
    <article className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-cr-dark/60 hover:text-cr-red mb-8">
          <ArrowLeft size={16} /> Retour
        </button>

        <span className="eyebrow">{article.categorie}</span>
        <h1 className="font-display uppercase font-extrabold text-3xl md:text-5xl mt-2 mb-4 leading-tight">{article.titre}</h1>
        <p className="text-sm text-cr-dark/50 mb-8">
          {toDate(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {article.image_url && (
          <div className="rounded-2xl overflow-hidden mb-8">
            <img src={article.image_url} alt={article.titre} className="w-full object-cover" />
          </div>
        )}

        <div className="prose max-w-none text-cr-dark/80 leading-relaxed whitespace-pre-line mb-10">
          {article.contenu}
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-cr-dark/10">
          <button onClick={share} className="btn-outline">
            {copied ? <><LinkIcon size={16} /> Lien copié</> : <><Share2 size={16} /> Partager</>}
          </button>
        </div>
      </div>
    </article>
  )
}
