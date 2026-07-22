import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import { supabase } from '../../supabase/config'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'titre', label: 'Titre', type: 'text' },
  { name: 'type', label: 'Type', type: 'select', options: ['photo', 'video'] },
  { name: 'url', label: 'Fichier (photo ou vidéo)', type: 'image' },
  {
    name: 'categorie',
    label: 'Catégorie',
    type: 'select',
    options: ['interventions', 'campagnes', 'formations', 'benevoles', 'evenements'],
  },
  { name: 'statut', label: 'Statut', type: 'select', options: ['brouillon', 'publie'] },
  { name: 'ordre', label: 'Ordre d\u2019affichage', type: 'number' },
]

const CATEGORIES = ['interventions', 'campagnes', 'formations', 'benevoles', 'evenements']

function BulkUploadModal({ onClose }) {
  const [files, setFiles] = useState([])
  const [categorie, setCategorie] = useState('interventions')
  const [statut, setStatut] = useState('publie')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files || []))
  }

  const handlePublish = async () => {
    if (!files.length) return
    setUploading(true)
    setProgress({ done: 0, total: files.length })
    try {
      for (const file of files) {
        const path = `galerie_medias/${Date.now()}_${file.name}`
        const { error: uploadError } = await supabase.storage.from('media').upload(path, file)
        if (uploadError) throw uploadError
        const { data: pub } = supabase.storage.from('media').getPublicUrl(path)
        const type = file.type.startsWith('video') ? 'video' : 'photo'
        const titre = file.name.replace(/\.[^/.]+$/, '')
        const { error: insertError } = await supabase.from('galerie_medias').insert({
          titre,
          type,
          url: pub.publicUrl,
          categorie,
          statut,
          ordre: 0,
        })
        if (insertError) throw insertError
        setProgress((p) => ({ ...p, done: p.done + 1 }))
      }
      onClose()
    } catch (err) {
      alert("Erreur lors de l'envoi : " + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display uppercase font-bold text-lg">Publier plusieurs médias</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Catégorie (appliquée à tous les fichiers)</label>
            <select value={categorie} onChange={(e) => setCategorie(e.target.value)}
              className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Statut</label>
            <select value={statut} onChange={(e) => setStatut(e.target.value)}
              className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red">
              <option value="publie">publie</option>
              <option value="brouillon">brouillon</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">
              Photos / vidéos (sélectionnez-en autant que vous voulez)
            </label>
            <label className="flex items-center justify-center gap-2 text-sm font-semibold text-cr-red border-2 border-dashed border-cr-red/30 rounded-lg py-6 cursor-pointer hover:bg-cr-red/5">
              <Upload size={18} /> Choisir des fichiers
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFilesChange} />
            </label>
            {files.length > 0 && (
              <p className="text-xs text-cr-dark/50 mt-2">{files.length} fichier(s) sélectionné(s)</p>
            )}
          </div>
        </div>

        <button
          onClick={handlePublish}
          disabled={uploading || !files.length}
          className="btn-primary w-full mt-5 disabled:opacity-60"
        >
          {uploading ? (
            <span className="flex items-center gap-2 justify-center">
              <Loader2 size={16} className="animate-spin" /> Envoi {progress.done}/{progress.total}...
            </span>
          ) : (
            `Publier ${files.length || ''} média(s)`
          )}
        </button>
      </div>
    </div>
  )
}

export default function GalerieTab() {
  const { data, loading } = useSupabaseCollection('galerie_medias', { orderByField: 'ordre', orderDirection: 'asc' })
  const [bulkOpen, setBulkOpen] = useState(false)

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={() => setBulkOpen(true)} className="btn-primary !py-2 !px-4 text-xs">
          <Upload size={15} /> Publier plusieurs médias
        </button>
      </div>
      <DataTable collectionName="galerie_medias" fields={FIELDS} data={data} titleField="titre" />
      {bulkOpen && <BulkUploadModal onClose={() => setBulkOpen(false)} />}
    </div>
  )
}
