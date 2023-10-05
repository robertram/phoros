import { useState, useMemo, useEffect } from "react";
import React from 'react'
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

interface LocationInputProps {
  onChange: (selection: any) => void
}

export default function LocationInput({ onChange }: LocationInputProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map onChange={onChange} />;
}

interface MapProps {
  onChange: (selection: any) => void
}

function Map({ onChange }: MapProps) {
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    onChange(selected)
  }, [selected])

  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} />
      </div>

      <GoogleMap
        zoom={18}
        center={selected ? selected : center}
        mapContainerClassName="map-container h-[300px]"
      // onClick={(e: any)=>{
      //   console.log('e', e);
      // }}
      >
        {selected && <Marker position={selected ? selected : center} />}
      </GoogleMap>
    </>
  );
}

const PlacesAutocomplete = ({ setSelected }: any) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng, address });
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        //className="combobox-input text-black"
        className='border border-gray-300 rounded-md p-2 w-full text-black mb-[15px]'
        placeholder="Search an address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} className="text-black" />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
