import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'titre', label: 'Titre', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'categorie', label: 'Catégorie', type: 'select', options: ['rapport', 'publication', 'document_officiel', 'photo', 'video'] },
  { name: 'image_url', label: 'Image de couverture (affichée sur la page Nos ressources)', type: 'image' },
  { name: 'fichier_url', label: 'Fichier (PDF, image ou vidéo à consulter/télécharger)', type: 'image' },
  { name: 'statut', label: 'Statut', type: 'select', options: ['brouillon', 'publie'] },
  { name: 'ordre', label: 'Ordre d\u2019affichage', type: 'number' },
]

export default function RessourcesTab() {
  const { data, loading } = useSupabaseCollection('ressources', { orderByField: 'ordre', orderDirection: 'asc' })
  if (loading) return <LoadingSpinner />
  return <DataTable collectionName="ressources" fields={FIELDS} data={data} titleField="titre" />
}
