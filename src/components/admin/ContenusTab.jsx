import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'cle', label: 'Clé (identifiant unique)', type: 'text' },
  { name: 'titre', label: 'Titre', type: 'text' },
  { name: 'valeur', label: 'Valeur / Texte', type: 'textarea' },
  { name: 'section', label: 'Section', type: 'text' },
]

export default function ContenusTab() {
  const { data, loading } = useSupabaseCollection('contenus')
  if (loading) return <LoadingSpinner />
  return <DataTable collectionName="contenus" fields={FIELDS} data={data} titleField="cle" />
}
