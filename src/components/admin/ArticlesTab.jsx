import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'titre', label: 'Titre', type: 'text' },
  { name: 'extrait', label: 'Extrait', type: 'textarea' },
  { name: 'contenu', label: 'Contenu', type: 'textarea' },
  { name: 'image_url', label: 'Image', type: 'image' },
  { name: 'categorie', label: 'Catégorie', type: 'select', options: ['operations', 'sante', 'formation', 'social'] },
  { name: 'date', label: 'Date (AAAA-MM-JJ)', type: 'text' },
  { name: 'statut', label: 'Statut', type: 'select', options: ['publie', 'brouillon'] },
]

export default function ArticlesTab() {
  const { data, loading } = useSupabaseCollection('articles', { orderByField: 'date', orderDirection: 'desc' })
  if (loading) return <LoadingSpinner />
  return <DataTable collectionName="articles" fields={FIELDS} data={data} />
}
