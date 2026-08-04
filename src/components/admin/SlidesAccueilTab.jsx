import { useState } from 'react'
import { Upload, Trash2, ExternalLink } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import { supabase } from '../../supabase/config'
import LoadingSpinner from '../shared/LoadingSpinner'

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX_DIM = 1600
        let { width, height } = img
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) { height = Math.round(height * (MAX_DIM / width)); width = MAX_DIM }
          else { width = Math.round(width * (MAX_DIM / height)); height = MAX_DIM }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }))
        }, 'image/jpeg', 0.8)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function SlidesAccueilTab() {
  const { data, loading } = useSupabaseCollection('slides_accueil', { orderByField: 'ordre', orderDirection: 'asc' })
  const [uploading, setUploading] = useState(false)

  const handleMultiUpload = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    setUploading(true)
    try {
      let ordre = data.length ? Math.max(...data.map((d) => d.ordre || 0)) + 1 : 0
      for (const file of files) {
        const compressed = await compressImage(file)
        const path = `slides_accueil/${Date.now()}_${compressed.name}`
        const { error: uploadError } = await supabase.storage.from('media').upload(path, compressed, { contentType: compressed.type })
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(path)
        await supabase.from('slides_accueil').insert({ image_url: urlData.publicUrl, statut: 'publie', ordre })
        ordre++
      }
    } catch (err) {
      alert("Erreur lors de l'envoi des images : " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const toggleStatut = async (slide) => {
    const nouveau = slide.statut === 'publie' ? 'brouillon' : 'publie'
    await supabase.from('slides_accueil').update({ statut: nouveau }).eq('id', slide.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce slide définitivement ?')) return
    await supabase.from('slides_accueil').delete().eq('id', id)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-white bg-cr-red px-4 py-2.5 rounded-lg cursor-pointer w-fit mb-5">
        <Upload size={16} /> {uploading ? 'Envoi en cours...' : 'Téléverser plusieurs images d\u2019un coup'}
        <input type="file" accept="image/*" multiple className="hidden" disabled={uploading}
          onChange={(e) => { handleMultiUpload(e.target.files); e.target.value = '' }} />
      </label>

      {!data.length ? (
        <p className="text-center text-cr-dark/40 py-10">Aucune image pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((slide) => (
            <div key={slide.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-cr-dark/5">
              <div className="relative aspect-video bg-cr-gray">
                <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
                <a
                  href={slide.image_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Ouvrir l'image en grand"
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1.5 text-white"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
              <div className="p-3 flex items-center justify-between">
                <button
                  onClick={() => toggleStatut(slide)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    slide.statut === 'publie' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {slide.statut}
                </button>
                <button onClick={() => handleDelete(slide.id)} className="p-1.5 rounded hover:bg-red-50 text-cr-red" aria-label="Supprimer">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}