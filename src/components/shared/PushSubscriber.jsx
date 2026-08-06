import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../supabase/config'

const VAPID_PUBLIC_KEY = 'BF4nj_mU--onfYrXepRpWQUK1b6UmuF9eisYa3k80pZRyXMB2lPVNwzqc45hlo7qEeegVxcDwGsKNVCsawJrfXw'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushSubscriber() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    const subscribe = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw-push.js')
        await navigator.serviceWorker.ready

        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        let subscription = await registration.pushManager.getSubscription()
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          })
        }

        const json = subscription.toJSON()
        await supabase.from('push_subscriptions').upsert({
          user_id: user.id,
          endpoint: json.endpoint,
          p256dh: json.keys.p256dh,
          auth: json.keys.auth,
        }, { onConflict: 'endpoint' })
      } catch (err) {
        console.error('Erreur abonnement push :', err)
      }
    }

    subscribe()
  }, [user])

  return null
}