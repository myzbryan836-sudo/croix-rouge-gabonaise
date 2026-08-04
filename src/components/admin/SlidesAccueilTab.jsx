import { useState } from 'react'
import { Upload } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import { supabase } from '../../supabase/config'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'image_url', label: 'Image du slide', type: 'image' },
  { name: 'statut', label: 'Statut', type: 'select', options: ['brouillon', 'publie'] },
  { name: 'ordre', label: 'Ordre d\u2019affichage', type: 'number' },
]

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

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-white bg-cr-red px-4 py-2.5 rounded-lg cursor-pointer w-fit mb-5">
        <Upload size={16} /> {uploading ? 'Envoi en cours...' : 'Téléverser plusieurs images d\u2019un coup'}
        <input type="file" accept="image/*" multiple className="hidden" disabled={uploading}
          onChange={(e) => { handleMultiUpload(e.target.files); e.target.value = '' }} />
      </label>

      <DataTable collectionName="slides_accueil" fields={FIELDS} data={data} titleField="image_url" />
    </div>
  )
}