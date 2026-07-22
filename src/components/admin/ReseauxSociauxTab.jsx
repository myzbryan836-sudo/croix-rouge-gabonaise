import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'plateforme', label: 'Plateforme', type: 'select', options: ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'X (Twitter)'] },
  { name: 'url', label: 'Lien du profil', type: 'text' },
  { name: 'actif', label: 'Actif (affiché sur le site)', type: 'select', options: ['true', 'false'] },
  { name: 'ordre', label: 'Ordre d\u2019affichage', type: 'number' },
]

export default function ReseauxSociauxTab() {
  const { data, loading } = useSupabaseCollection('reseaux_sociaux', { orderByField: 'ordre', orderDirection: 'asc' })
  if (loading) return <LoadingSpinner />
  return <DataTable collectionName="reseaux_sociaux" fields={FIELDS} data={data} titleField="plateforme" />
}
