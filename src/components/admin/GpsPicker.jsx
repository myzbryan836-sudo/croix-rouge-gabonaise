import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocateFixed } from 'lucide-react'

// Icônes par défaut de Leaflet chargées depuis un CDN (évite les soucis de résolution
// des assets par les bundlers comme Vite).
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const GABON_CENTER = [-0.8037, 11.6094]

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function RecenterOnChange({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 14))
  }, [position?.[0], position?.[1]]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

/**
 * Sélecteur GPS pour les formulaires admin : carte cliquable pour poser le repère,
 * bouton "Utiliser ma position actuelle" (géolocalisation navigateur), et champs
 * numériques éditables en secours pour une saisie manuelle précise.
 */
export default function GpsPicker({ lat, lng, onChange }) {
  const [locating, setLocating] = useState(false)
  const position = lat !== '' && lat != null && lng !== '' && lng != null ? [Number(lat), Number(lng)] : null

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas disponible sur cet appareil.")
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude)
        setLocating(false)
      },
      () => {
        alert('Impossible de récupérer votre position. Vérifiez les autorisations de localisation.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          value={lat ?? ''}
          onChange={(e) => onChange(e.target.value, lng)}
          className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red"
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude"
          value={lng ?? ''}
          onChange={(e) => onChange(lat, e.target.value)}
          className="w-full border border-cr-dark/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cr-red"
        />
      </div>

      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        className="flex items-center gap-1.5 text-xs font-semibold text-cr-red disabled:opacity-50"
      >
        <LocateFixed size={14} /> {locating ? 'Localisation en cours...' : 'Utiliser ma position actuelle'}
      </button>

      <div className="h-52 rounded-lg overflow-hidden border border-cr-dark/15">
        <MapContainer center={position || GABON_CENTER} zoom={position ? 14 : 6} className="w-full h-full" scrollWheelZoom>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onPick={onChange} />
          <RecenterOnChange position={position} />
          {position && <Marker position={position} icon={markerIcon} />}
        </MapContainer>
      </div>
      <p className="text-[11px] text-cr-dark/40">Cliquez sur la carte pour placer le repère, ou utilisez votre position actuelle.</p>
    </div>
  )
}
