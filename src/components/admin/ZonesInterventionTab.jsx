import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'province', label: 'Province', type: 'text' },
  { name: 'ville', label: 'Ville', type: 'text' },
  { name: 'quartier', label: 'Quartier', type: 'text' },
  { name: 'localisation', label: 'Localisation GPS', type: 'gps', latField: 'gps_lat', lngField: 'gps_lng' },
  { name: 'type_intervention', label: 'Type d\u2019intervention', type: 'text' },
  { name: 'etat_intervention', label: 'État de l\u2019intervention (rouge sur la carte si terminée)', type: 'select', options: ['en_cours', 'terminee'] },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'image_url', label: 'Photo', type: 'image' },
  { name: 'statut', label: 'Statut', type: 'select', options: ['brouillon', 'publie'] },
  { name: 'ordre', label: 'Ordre d\u2019affichage', type: 'number' },
]

export default function ZonesInterventionTab() {
  const { data, loading } = useSupabaseCollection('zones_intervention', { orderByField: 'ordre', orderDirection: 'asc' })
  if (loading) return <LoadingSpinner />
  return <DataTable collectionName="zones_intervention" fields={FIELDS} data={data} titleField="ville" />
}
