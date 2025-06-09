"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
//import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"

type LatLngTuple = [number, number]

interface LeafletMapProps {
  center: LatLngTuple
  zoom: number
  markers?: Array<{
    position: LatLngTuple
    popup?: string
  }>
  showCurrentLocation?: boolean
  customPin?: LatLngTuple
}

// function LocationMarker({ position, popup }: { position: LatLngTuple; popup?: string }) {
//   const map = useMap()

//   useEffect(() => {
//     map.flyTo(position, map.getZoom())
//   }, [map, position])

//   return <Marker position={position}>{popup && <Popup>{popup}</Popup>}</Marker>
// }

// const LeafletMap: React.FC<LeafletMapProps> = ({
//   center,
//   zoom,
//   markers = [],
//   showCurrentLocation = false,
//   customPin,
// }) => {
//   const [currentLocation, setCurrentLocation] = useState<LatLngTuple | null>(null)
//   const mapRef = useRef<L.Map>(null)

//   useEffect(() => {
//     // Fix for the missing icon issue
//     delete (L.Icon.Default.prototype as any)._getIconUrl
//     L.Icon.Default.mergeOptions({
//       iconRetinaUrl: "/leaflet/marker-icon-2x.png",
//       iconUrl: "/leaflet/marker-icon.png",
//       shadowUrl: "/leaflet/marker-shadow.png",
//     })

//     if (showCurrentLocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation([position.coords.latitude, position.coords.longitude])
//         },
//         (error) => {
//           console.error("Error getting current location:", error)
//         },
//       )
//     }
//   }, [showCurrentLocation])

//   return (
//     <MapContainer center={center} zoom={zoom} style={{ height: "400px", width: "100%" }} ref={mapRef}>
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {markers.map((marker, index) => (
//         <Marker key={index} position={marker.position}>
//           {marker.popup && <Popup>{marker.popup}</Popup>}
//         </Marker>
//       ))}
//       {showCurrentLocation && currentLocation && <LocationMarker position={currentLocation} popup="You are here" />}
//       {customPin && <LocationMarker position={customPin} popup="Custom location" />}
//     </MapContainer>
//   )
// }

export default LeafletMapProps

