export const CATEGORIES = [
  { value: 'article', label: 'Article' },
  { value: 'communique', label: 'Communiqué' },
  { value: 'rapport', label: 'Rapport' },
  { value: 'publication', label: 'Publication' },
  { value: 'evenement', label: 'Événement' },
]

export function categorieLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value || '—'
}