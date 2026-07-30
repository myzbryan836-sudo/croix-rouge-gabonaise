import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Upload, FileText, Tag as TagIcon, Eye, Copy, Film } from 'lucide-react'
import { supabase } from '../../supabase/config'
import { CATEGORIES, categorieLabel } from '../../utils/articleCategories'


const emptyArticle = () => ({
  titre: '',
  extrait: '',
  image_url: '',
  galerie: [],
  pdf_url: '',
  categorie: '',
  auteur: '',
  date: new Date().toISOString().slice(0, 10),
  statut: 'brouillon',
  tags: [],
})


export default function ArticleForm({ data }) {
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const handleChange = (name, value) => setEditing((e) => ({ ...e, [name]: value }))

  const openCreate = () => { setEditing(emptyArticle()); setShowPreview(false) }
  const openEdit = (item) => { setEditing({ ...emptyArticle(), ...item }); setShowPreview(false) }
  const close = () => { setEditing(null); setShowPreview(false); setTagInput('') }

  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) return resolve(file)
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

  const uploadFile = async (file, prefix) => {
    const compressed = await compressImage(file)
    const path = `articles/${prefix}_${Date.now()}_${compressed.name}`
    const { error } = await supabase.storage.from('media').upload(path, compressed)
    if (error) throw error
    return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
  }

  const handleCoverUpload = async (file) => {
    if (!file) return
    setUploadingCover(true)
    try {
      const url = await uploadFile(file, 'cover')
      handleChange('image_url', url)
    } catch (err) {
      alert("Erreur lors de l'envoi de l'image : " + err.message)
    } finally {
      setUploadingCover(false)
    }
  }

  const handleGalleryUpload = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    setUploadingGallery(true)
    try {
      const uploaded = []
      for (const file of files) {
        const url = await uploadFile(file, 'galerie')
        uploaded.push({ type: file.type.startsWith('video/') ? 'video' : 'image', url })
      }
      setEditing((e) => ({ ...e, galerie: [...(e.galerie || []), ...uploaded] }))
    } catch (err) {
      alert("Erreur lors de l'envoi de la galerie : " + err.message)
    } finally {
      setUploadingGallery(false)
    }
  }

  const removeGalleryItem = (index) => {
    setEditing((e) => ({ ...e, galerie: e.galerie.filter((_, i) => i !== index) }))
  }

  const handlePdfUpload = async (file) => {
    if (!file) return
    setUploadingPdf(true)
    try {
      const url = await uploadFile(file, 'pdf')
      handleChange('pdf_url', url)
    } catch (err) {
      alert("Erreur lors de l'envoi du PDF : " + err.message)
    } finally {
      setUploadingPdf(false)
    }
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (!t) return
    if (!(editing.tags || []).includes(t)) {
      setEditing((e) => ({ ...e, tags: [...(e.tags || []), t] }))
    }
    setTagInput('')
  }

  const removeTag = (t) => {
    setEditing((e) => ({ ...e, tags: (e.tags || []).filter((x) => x !== t) }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { id, ...payload } = editing
      if (id) {
        const { error } = await supabase.from('articles').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('articles').insert(payload)
        if (error) throw error
      }
      close()
    } catch (err) {
      alert("Erreur lors de l'enregistrement : " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet article définitivement ?')) return
    await supabase.from('articles').delete().eq('id', id)
  }

  const shareUrl = editing?.id
    ? `${window.location.origin}/actualites/${editing.id}`
    : null

  const copyShareLink = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    alert('Lien copié dans le presse-papiers.')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-cr-dark/50">{data.length} article(s)</p>
        <button onClick={openCreate} className="btn-primary !py-2 !px-4 text-xs">
          <Plus size={15} /> Ajouter un article
        </button>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-cr-gray text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Titre</th>
              <th className="px-4 py-3 font-semibold">Catégorie</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t border-cr-dark/5">
                <td className="px-4 py-3">{item.titre || '—'}</td>
                <td className="px-4 py-3">{categorieLabel(item.categorie)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    item.statut === 'publie' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.statut === 'publie' ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-cr-gray"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-red-50 text-cr-red"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!data.length && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-cr-dark/40">Aucun article pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={close}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display uppercase font-bold text-lg">{editing.id ? 'Modifier l\u2019article' : 'Nouvel article'}</h3>
              <button onClick={close}><X size={20} /></button>
            </div>

            {!showPreview ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Titre</label>
                  <input value={editing.titre} onChange={(e) => handleChange('titre', e.target.value)}
                    className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Extrait / Résumé</label>
                  <textarea rows={3} value={editing.extrait} onChange={(e) => handleChange('extrait', e.target.value)}
                    className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Image de couverture</label>
                  <div className="space-y-2">
                    <input value={editing.image_url} onChange={(e) => handleChange('image_url', e.target.value)} placeholder="URL de l'image"
                      className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                    <label className="flex items-center gap-2 text-xs font-semibold text-cr-red cursor-pointer w-fit">
                      <Upload size={14} /> {uploadingCover ? 'Envoi...' : 'Téléverser une image'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCoverUpload(e.target.files[0])} />
                    </label>
                    {editing.image_url && <img src={editing.image_url} alt="" className="h-24 rounded-lg object-cover" />}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Galerie médias (photos / vidéos)</label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-cr-red cursor-pointer w-fit mb-2">
                    <Upload size={14} /> {uploadingGallery ? 'Envoi...' : 'Ajouter des fichiers'}
                    <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => handleGalleryUpload(e.target.files)} />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(editing.galerie || []).map((m, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-cr-dark/15 bg-black">
                        {m.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center text-white"><Film size={20} /></div>
                        ) : (
                          <img src={m.url} alt="" className="w-full h-full object-cover" />
                        )}
                        <button onClick={() => removeGalleryItem(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Fichier PDF à télécharger</label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-cr-red cursor-pointer w-fit">
                    <Upload size={14} /> {uploadingPdf ? 'Envoi...' : 'Téléverser un PDF'}
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handlePdfUpload(e.target.files[0])} />
                  </label>
                  {editing.pdf_url && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-cr-dark/70">
                      <FileText size={14} />
                      <a href={editing.pdf_url} target="_blank" rel="noreferrer" className="underline">Voir le PDF joint</a>
                      <button onClick={() => handleChange('pdf_url', '')} className="text-cr-red">Retirer</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Catégorie</label>
                    <select value={editing.categorie} onChange={(e) => handleChange('categorie', e.target.value)}
                      className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red">
                      <option value="">—</option>
                      {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Statut</label>
                    <select value={editing.statut} onChange={(e) => handleChange('statut', e.target.value)}
                      className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red">
                      <option value="brouillon">Brouillon</option>
                      <option value="publie">Publié</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Auteur</label>
                    <input value={editing.auteur} onChange={(e) => handleChange('auteur', e.target.value)}
                      className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Date de publication</label>
                    <input type="date" value={editing.date} onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                      placeholder="Ajouter un tag puis Entrée"
                      className="flex-1 border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                    <button onClick={addTag} className="px-3 rounded-lg border border-cr-dark/15 text-xs font-semibold"><TagIcon size={14} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(editing.tags || []).map((t) => (
                      <span key={t} className="flex items-center gap-1 bg-cr-gray text-xs px-2.5 py-1 rounded-full">
                        {t} <button onClick={() => removeTag(t)}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {editing.id && (
                  <div>
                    <label className="text-xs font-semibold text-cr-dark/60 mb-1 block">Partage sur les réseaux sociaux</label>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <a target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-cr-gray"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}>Facebook</a>
                      <a target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-cr-gray"
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(editing.titre)}`}>X (Twitter)</a>
                      <a target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-cr-gray"
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(editing.titre + ' ' + shareUrl)}`}>WhatsApp</a>
                      <button onClick={copyShareLink} className="px-3 py-1.5 rounded-lg bg-cr-gray flex items-center gap-1"><Copy size={12} /> Copier le lien</button>
                    </div>
                  </div>
                )}

                <button onClick={() => setShowPreview(true)} className="w-full py-2 rounded-lg border border-cr-dark/15 text-xs font-semibold flex items-center justify-center gap-2">
                  <Eye size={14} /> Prévisualiser avant publication
                </button>

                <button onClick={handleSave} disabled={saving} className="btn-primary w-full mt-2 disabled:opacity-60">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button onClick={() => setShowPreview(false)} className="text-xs font-semibold text-cr-red">&larr; Retour au formulaire</button>
                {editing.image_url && <img src={editing.image_url} alt="" className="w-full h-48 object-cover rounded-lg" />}
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-cr-gray">{categorieLabel(editing.categorie)}</span>
                <h2 className="font-display uppercase font-bold text-2xl">{editing.titre || 'Titre de l\u2019article'}</h2>
                <p className="text-xs text-cr-dark/50">{editing.auteur || 'Auteur'} — {editing.date}</p>
                <p className="text-sm text-cr-dark/80">{editing.extrait}</p>
                {(editing.galerie || []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editing.galerie.map((m, i) => (
                      <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-black">
                        {m.type === 'video' ? <video src={m.url} className="w-full h-full object-cover" /> : <img src={m.url} alt="" className="w-full h-full object-cover" />}
                      </div>
                    ))}
                  </div>
                )}
                {editing.pdf_url && <a href={editing.pdf_url} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1"><FileText size={14} /> Télécharger le PDF</a>}
                <div className="flex flex-wrap gap-2">
                  {(editing.tags || []).map((t) => <span key={t} className="bg-cr-gray text-xs px-2.5 py-1 rounded-full">{t}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
