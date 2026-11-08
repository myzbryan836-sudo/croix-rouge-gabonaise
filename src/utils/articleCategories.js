export const CATEGORIES = [
  { value: 'article', label: 'Article' },
  { value: 'communique', label: 'Communiqué' },
  { value: 'rapport', label: 'Rapport' },
  { value: 'publication', label: 'Publication' },
  { value: 'evenement', label: 'Événement' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'partenariat', label: 'Partenariat' },
  { value: 'temoignage', label: 'T\u00e9moignage' },
  { value: 'sensibilisation', label: 'Sensibilisation' },
]

export function categorieLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value || '—'
}