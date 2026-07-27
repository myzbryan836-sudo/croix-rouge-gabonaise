import { useSupabaseCollection } from '../../hooks/useSupabaseCollection'
import ArticleForm from './ArticleForm'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function ArticlesTab() {
  const { data, loading } = useSupabaseCollection('articles', { orderByField: 'date', orderDirection: 'desc' })
  if (loading) return <LoadingSpinner />
  return <ArticleForm data={data} />
}