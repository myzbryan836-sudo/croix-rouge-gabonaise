import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase/config'

// Cache mémoire partagé entre tous les composants qui lisent la même table,
// pour la durée de la session (tant que l'onglet n'est pas rechargé).
// Objectif : quand on quitte une page puis qu'on y revient (ex. retour sur
// l'accueil), on réaffiche instantanément les dernières données connues au
// lieu de repartir de zéro (tableau vide) le temps que Supabase réponde —
// c'est ce qui causait le "flash" de l'ancien contenu / image par défaut.
const cache = new Map()

/**
 * Lit une table Supabase et se met a jour en temps reel via Supabase Realtime.
 * @param {string} table - nom de la table
 * @param {object} options - { statut, orderByField, orderDirection }
 */
export function useSupabaseCollection(table, options = {}) {
  const { statut, orderByField, orderDirection = 'desc' } = options
  const cacheKey = `${table}|${statut || ''}|${orderByField || ''}|${orderDirection}`
  const cached = cache.get(cacheKey)

  const [data, setData] = useState(cached || [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    let query = supabase.from(table).select('*')
    if (statut) query = query.eq('statut', statut)
    if (orderByField) query = query.order(orderByField, { ascending: orderDirection === 'asc' })

    const { data: rows, error: fetchError } = await query
    if (fetchError) {
      setError(fetchError)
    } else {
      cache.set(cacheKey, rows || [])
      setData(rows || [])
      setError(null)
    }
    setLoading(false)
  }, [table, statut, orderByField, orderDirection, cacheKey])

  useEffect(() => {
    const existing = cache.get(cacheKey)
    if (existing) {
      // On a déjà des données en cache : on les affiche tout de suite (pas de
      // flash) et on rafraîchit discrètement en arrière-plan.
      setData(existing)
      setLoading(false)
    } else {
      setLoading(true)
    }
    fetchData()

    const channelName = `${table}-${statut || 'all'}-${Date.now()}-${Math.random().toString(36).slice(2)}`

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData, table, statut, cacheKey])

  return { data, loading, error }
}
