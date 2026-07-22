import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'titre', label: 'Titre', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'image_url', label: 'Image', type: 'image' },
  { name: 'lien', label: 'Lien', type: 'text' },
  { name: 'type', label: 'Type', type: 'select', options: ['annonce', 'publicite', 'banniere'] },
  { name: 'statut', label: 'Statut', type: 'select', options: ['publie', 'brouillon'] },
  { name: 'ordre', label: 'Ordre', type: 'number' },
]

export default function AnnoncesTab() {
  const { data, loading } = useSupabaseCollection('annonces', { orderByField: 'ordre', orderDirection: 'asc' })
  if (loading) return <LoadingSpinner />
  return <DataTable collectionName="annonces" fields={FIELDS} data={data} />
}
