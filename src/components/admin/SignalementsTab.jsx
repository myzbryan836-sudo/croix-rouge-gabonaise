import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import StatusTable from './StatusTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const COLUMNS = [
  { key: 'nom', label: 'Nom' },
  { key: 'type_urgence', label: 'Type' },
  { key: 'localisation', label: 'Localisation' },
  { key: 'telephone', label: 'Téléphone' },
]

const DETAIL_FIELDS = [
  { key: 'email', label: 'Email' },
  { key: 'description', label: 'Description du signalement' },
]

export default function SignalementsTab() {
  const { data, loading } = useSupabaseCollection('signalements', { orderByField: 'cree_le', orderDirection: 'desc' })
  if (loading) return <LoadingSpinner />
  return (
    <StatusTable
      collectionName="signalements"
      data={data}
      columns={COLUMNS}
      detailFields={DETAIL_FIELDS}
      statuses={['nouveau', 'en_cours', 'traite', 'rejete']}
    />
  )
}
