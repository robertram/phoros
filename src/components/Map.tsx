import React from 'react'
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Loading } from "./Loading";

interface MapProps {
  lat: string
  lng: string
}

export default function Map({ lat, lng }: MapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ["places"],
  });

  if (!isLoaded) return <Loading />
  return (
    <GoogleMap
      zoom={18}
      center={{ lat: Number(lat), lng: Number(lng) }}
      mapContainerClassName="map-container h-[300px]"
    >
      <Marker position={{ lat: Number(lat), lng: Number(lng) }} />
    </GoogleMap>
  );
}




