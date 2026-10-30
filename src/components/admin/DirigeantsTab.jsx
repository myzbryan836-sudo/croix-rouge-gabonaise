import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'photo_url', label: 'Photo', type: 'image' },
  { name: 'prenom', label: 'Prénom', type: 'text' },
  { name: 'nom', label: 'Nom', type: 'text' },
  { name: 'fonction', label: 'Fonction', type: 'text' },
  { name: 'statut', label: 'Statut', type: 'select', options: ['publie', 'brouillon'] },
  { name: 'ordre', label: 'Ordre d\u2019affichage (1 = premier)', type: 'number' },
]

export default function DirigeantsTab() {
  const { data, loading } = useSupabaseCollection('dirigeants', { orderByField: 'ordre', orderDirection: 'asc' })
  if (loading) return <LoadingSpinner />
  return <DataTable collectionName="dirigeants" fields={FIELDS} data={data} titleField="nom" />
}