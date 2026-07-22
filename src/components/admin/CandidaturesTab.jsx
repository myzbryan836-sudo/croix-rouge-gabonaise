import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import StatusTable from './StatusTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const COLUMNS = [
  { key: 'nom', label: 'Nom' },
  { key: 'ville', label: 'Ville' },
  { key: 'telephone', label: 'Téléphone' },
  { key: 'email', label: 'Email' },
]

const DETAIL_FIELDS = [
  { key: 'disponibilites', label: 'Disponibilités' },
  { key: 'competences', label: 'Compétences' },
  { key: 'motivation', label: 'Motivation' },
]

export default function CandidaturesTab() {
  const { data, loading } = useSupabaseCollection('candidatures_benevoles', { orderByField: 'cree_le', orderDirection: 'desc' })
  if (loading) return <LoadingSpinner />
  return (
    <StatusTable
      collectionName="candidatures_benevoles"
      data={data}
      columns={COLUMNS}
      detailFields={DETAIL_FIELDS}
      statuses={['nouveau', 'en_cours', 'accepte', 'refuse']}
    />
  )
}
