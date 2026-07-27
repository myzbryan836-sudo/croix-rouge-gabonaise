import { useState, useMemo, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, LayersControl, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Layers, LocateFixed } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const markerIconRouge = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const userIcon = new L.DivIcon({
  className: '',
  html: '<div class="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-200 border-2 border-white"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const GABON_CENTER = [-0.8037, 11.6094]
const QUARTIER_ZOOM = 16

function FlyToZone({ zone, markerRefs }) {
  const map = useMap()
  useEffect(() => {
    if (!zone) return
    map.flyTo([zone.gps_lat, zone.gps_lng], QUARTIER_ZOOM, { duration: 1 })
    const timer = setTimeout(() => {
      markerRefs.current[zone.id]?.openPopup()
    }, 1050)
    return () => clearTimeout(timer)
  }, [zone, map, markerRefs])
  return null
}

function LocateControl({ onLocate }) {
  const map = useMap()
  const [locating, setLocating] = useState(false)

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas disponible sur cet appareil.")
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        onLocate([latitude, longitude])
        map.flyTo([latitude, longitude], 16, { duration: 1 })
        setLocating(false)
      },
      (err) => {
        alert("Impossible d'obtenir votre position : " + err.message)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          type="button"
          onClick={handleLocate}
          title="Me localiser"
          className="bg-white w-9 h-9 flex items-center justify-center hover:bg-cr-gray"
        >
          <LocateFixed size={16} className={locating ? 'animate-pulse text-cr-red' : 'text-cr-dark'} />
        </button>
      </div>
    </div>
  )
}

export default function CarteInterventions() {
  const { data, loading } = useSupabaseCollection('zones_intervention', { statut: 'publie', orderByField: 'ordre', orderDirection: 'asc' })
  const [selected, setSelected] = useState(null)
  const [userPosition, setUserPosition] = useState(null)
  const markerRefs = useRef({})

  const zones = useMemo(() => data.filter((z) => z.gps_lat && z.gps_lng), [data])

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <span className="eyebrow mb-2 block">Où nous intervenons</span>
        <h1 className="section-title mb-4">Carte de nos interventions</h1>
        <p className="text-cr-dark/60 max-w-2xl mb-8">
          Explorez les zones où la Croix-Rouge Gabonaise mène ses actions de secours, de santé et d'aide humanitaire.
        </p>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid md:grid-cols-[320px_1fr] gap-5">
            <div className="bg-white rounded-2xl shadow-sm border border-cr-dark/5 overflow-hidden max-h-[560px] overflow-y-auto order-2 md:order-1">
              {zones.length === 0 ? (
                <p className="text-cr-dark/40 text-sm p-6 text-center">Information en cours de mise à jour.</p>
              ) : (
                zones.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setSelected(z)}
                    className={`w-full text-left px-5 py-4 border-b border-cr-dark/5 hover:bg-cr-gray transition-colors ${
                      selected?.id === z.id ? 'bg-cr-gray' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={14} className={`shrink-0 ${z.etat_intervention === 'terminee' ? 'text-red-600' : 'text-cr-red'}`} />
                      <span className="font-display uppercase font-bold text-sm">{z.quartier ? `${z.quartier}, ` : ''}{z.ville}</span>
                    </div>
                    <p className="text-xs text-cr-dark/50">{z.province}</p>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {z.type_intervention && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-cr-red bg-cr-red/10 px-2 py-0.5 rounded-full">
                          {z.type_intervention}
                        </span>
                      )}
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        z.etat_intervention === 'terminee' ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'
                      }`}>
                        {z.etat_intervention === 'terminee' ? 'Intervention terminée' : 'En cours'}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-cr-dark/5 h-[420px] md:h-[560px] order-1 md:order-2">
              <MapContainer center={GABON_CENTER} zoom={7} maxZoom={19} scrollWheelZoom className="w-full h-full">
                <LayersControl position="topleft">
                  <LayersControl.BaseLayer checked name="Plan standard">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      maxZoom={19}
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="Satellite">
                    <TileLayer
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      maxZoom={19}
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>

                <FlyToZone zone={selected} markerRefs={markerRefs} />
                <LocateControl onLocate={setUserPosition} />

                {zones.map((z) => (
                  <Marker
                    key={z.id}
                    position={[z.gps_lat, z.gps_lng]}
                    icon={z.etat_intervention === 'terminee' ? markerIconRouge : markerIcon}
                    eventHandlers={{ click: () => setSelected(z) }}
                    ref={(el) => { if (el) markerRefs.current[z.id] = el }}
                  >
                    <Popup>
                      <div className="max-w-[200px]">
                        <p className="font-bold mb-1">{z.quartier ? `${z.quartier}, ` : ''}{z.ville}, {z.province}</p>
                        {z.type_intervention && <p className="text-xs text-cr-red font-semibold mb-1">{z.type_intervention}</p>}
                        <p className={`text-xs font-semibold mb-1 ${z.etat_intervention === 'terminee' ? 'text-red-600' : 'text-green-600'}`}>
                          {z.etat_intervention === 'terminee' ? 'Intervention terminée' : 'Intervention en cours'}
                        </p>
                        {z.image_url && <img src={z.image_url} alt={z.ville} className="rounded-md mb-1 w-full h-24 object-cover" />}
                        {z.description && <p className="text-xs text-cr-dark/70">{z.description}</p>}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {userPosition && (
                  <Marker position={userPosition} icon={userIcon}>
                    <Popup>Vous êtes ici</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <p className="flex items-center gap-2 text-xs text-cr-dark/40">
            <Layers size={13} /> Cliquez sur l'icône de calques (haut gauche) pour basculer plan / satellite. Icône GPS (haut droite) pour vous localiser.
          </p>
          <span className="flex items-center gap-1.5 text-xs text-cr-dark/60">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> En cours
          </span>
          <span className="flex items-center gap-1.5 text-xs text-cr-dark/60">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Intervention terminée
          </span>
        </div>
      </div>
    </div>
  )
}