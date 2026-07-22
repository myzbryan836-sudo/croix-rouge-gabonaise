import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import StatusTable from './StatusTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const COLUMNS = [
  { key: 'nom_donateur', label: 'Donateur' },
  { key: 'montant', label: 'Montant (FCFA)' },
  { key: 'type', label: 'Type' },
  { key: 'methode', label: 'Méthode' },
  { key: 'email_donateur', label: 'Email' },
]

export default function DonsTab() {
  const { data, loading } = useSupabaseCollection('dons', { orderByField: 'cree_le', orderDirection: 'desc' })
  if (loading) return <LoadingSpinner />
  return <StatusTable collectionName="dons" data={data} columns={COLUMNS} statuses={['en_attente', 'complete', 'echoue']} />
}
