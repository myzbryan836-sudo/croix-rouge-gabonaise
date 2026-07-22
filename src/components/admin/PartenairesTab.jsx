import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import DataTable from './DataTable'
import LoadingSpinner from '../shared/LoadingSpinner'

const FIELDS = [
  { name: 'nom', label: 'Nom du partenaire', type: 'text' },
  { name: 'logo_url', label: 'Logo', type: 'image' },
  { name: 'description', label: 'Description', type: 'textarea' },
  {
    name: 'categorie',
    label: 'Catégorie',
    type: 'select',
    options: ['institution_publique', 'entreprise', 'ong', 'organisation_internationale', 'partenaire_technique_financier'],
  },
  { name: 'lien', label: 'Lien officiel', type: 'text' },
  { name: 'statut', label: 'Statut', type: 'select', options: ['brouillon', 'publie'] },
  { name: 'ordre', label: 'Ordre d\u2019affichage', type: 'number' },
]

export default function PartenairesTab() {
  const { data, loading } = useSupabaseCollection('partenaires', { orderByField: 'ordre', orderDirection: 'asc' })
  if (loading) return <LoadingSpinner />
  return <DataTable collectionName="partenaires" fields={FIELDS} data={data} titleField="nom" />
}
