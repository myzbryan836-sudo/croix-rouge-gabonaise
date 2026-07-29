import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle2, AlertTriangle, Upload, Trash2, Film } from 'lucide-react'
import { supabase } from '../../supabase/config'

const TYPES = [
  { value: 'urgence', label: 'Urgence médicale' },
  { value: 'incendie', label: 'Incendie' },
  { value: 'sante', label: 'Problème de santé' },
  { value: 'social', label: 'Détresse sociale' },
  { value: 'autre', label: 'Autre' },
]

const MAX_FILES = 5

const initialForm = {
  nom: '',
  email: '',
  telephone: '',
  type_urgence: 'urgence',
  localisation: '',
  description: '',
}

export default function AlertModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm)
  const [files, setFiles] = useState([]) // { file, preview, type }
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleFilesSelect = (fileList) => {
    const selected = Array.from(fileList || [])
    if (!selected.length) return
    setFiles((prev) => {
      const room = MAX_FILES - prev.length
      if (room <= 0) {
        setError(`Vous ne pouvez envoyer que ${MAX_FILES} fichiers maximum.`)
        return prev
      }
      const toAdd = selected.slice(0, room).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image',
      }))
      if (selected.length > room) {
        setError(`Seuls ${room} fichier(s) supplémentaire(s) ont été ajoutés (limite de ${MAX_FILES}).`)
      }
      return [...prev, ...toAdd]
    })
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      let media_urls = []
      if (files.length) {
        setUploading(true)
        for (const f of files) {
          const path = `signalements/${Date.now()}_${f.file.name}`
          const { error: uploadError } = await supabase.storage.from('media').upload(path, f.file)
          if (uploadError) throw uploadError
          const url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl
          media_urls.push(url)
        }
        setUploading(false)
      }

      const { error: insertError } = await supabase.from('signalements').insert({
        ...form,
        media_urls,
        statut: 'nouveau',
      })
      if (insertError) throw insertError
      setSent(true)
      setForm(initialForm)
      setFiles([])
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer ou appeler directement le 1400.")
    } finally {
      setSending(false)
      setUploading(false)
    }
  }

  const handleClose = () => {
    setSent(false)
    setError('')
    setFiles([])
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 flex items-end md:items-center justify-center p-0 md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white w-full md:max-w-lg md:rounded-2xl rounded-t-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="text-cr-red" size={20} />
                </div>
                <h3 className="font-display uppercase font-extrabold text-xl">Cri d'alerte</h3>
              </div>
              <button onClick={handleClose} aria-label="Fermer" className="text-cr-dark/50 hover:text-cr-dark">
                <X size={22} />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <CheckCircle2 className="mx-auto text-green-600 mb-3" size={48} />
                <p className="font-semibold text-lg mb-1">Signalement envoyé</p>
                <p className="text-sm text-cr-dark/70 mb-6">
                  Une équipe de la Croix-Rouge Gabonaise va examiner votre demande. En cas de danger immédiat, appelez le 1400.
                </p>
                <button onClick={handleClose} className="btn-primary w-full">Fermer</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-sm text-cr-dark/60 mb-2">
                  Décrivez la situation. Notre équipe traitera votre signalement dans les meilleurs délais.
                </p>
                <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom complet"
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                <div className="grid grid-cols-2 gap-3">
                  <input name="telephone" value={form.telephone} onChange={handleChange} required placeholder="Téléphone"
                    className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email (optionnel)"
                    className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                </div>
                <select name="type_urgence" value={form.type_urgence} onChange={handleChange}
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red">
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input name="localisation" value={form.localisation} onChange={handleChange} required placeholder="Localisation (quartier, ville)"
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red" />
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Décrivez la situation"
                  className="w-full border border-cr-dark/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red resize-none" />

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-cr-red cursor-pointer w-fit">
                    <Upload size={16} /> Ajouter des photos/vidéos ({files.length}/{MAX_FILES})
                    <input type="file" accept="image/*,video/*" multiple className="hidden"
                      disabled={files.length >= MAX_FILES}
                      onChange={(e) => { handleFilesSelect(e.target.files); e.target.value = '' }} />
                  </label>
                  {files.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {files.map((f, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-black">
                          {f.type === 'video' ? (
                            <video src={f.preview} className="w-full h-full object-cover" />
                          ) : (
                            <img src={f.preview} alt="" className="w-full h-full object-cover" />
                          )}
                          {f.type === 'video' && (
                            <Film size={14} className="absolute top-1 left-1 text-white drop-shadow" />
                          )}
                          <button type="button" onClick={() => removeFile(i)}
                            className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && <p className="text-sm text-cr-red">{error}</p>}
                <button type="submit" disabled={sending} className="btn-primary w-full mt-2 disabled:opacity-60">
                  {uploading ? 'Envoi des fichiers...' : sending ? 'Envoi...' : <>Envoyer le signalement <Send size={16} /></>}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}