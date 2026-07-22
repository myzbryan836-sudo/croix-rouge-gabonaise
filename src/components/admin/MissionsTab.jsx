import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'titre', label: 'Titre', type: 'text' },
  { name: 'badge', label: 'Badge', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'image_url', label: 'Image', type: 'image' },
  { name: 'icone', label: 'Icône', type: 'select', options: ['urgence', 'sante', 'social', 'formation'] },
  { name: 'actions', label: 'Actions (une par ligne)', type: 'list' },
  { name: 'stat', label: 'Statistique clé', type: 'text' },
  { name: 'statut', label: 'Statut', type: 'select', options: ['publie', 'brouillon'] },
  { name: 'ordre', label: 'Ordre', type: 'number' },
]

export default function MissionsTab() {
  const { data, loading } = useSupabaseCollection('missions', { orderByField: 'ordre', orderDirection: 'asc' })
  if (loading) return <LoadingSpinner />
  return <DataTable collectionName="missions" fields={FIELDS} data={data} />
}
