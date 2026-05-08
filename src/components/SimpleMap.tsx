import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { Loader2, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface MapPlace {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  phone?: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface SimpleMapProps {
  type: 'medical' | 'restroom';
  userLocation?: {
    lat: number;
    lng: number;
  };
  restrooms?: MapPlace[];
  onPlacesLoaded?: (places: MapPlace[]) => void;
  onPlacesError?: (message: string) => void;
}

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const earthRadiusKm = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const miles = earthRadiusKm * c * 0.621371;

  return miles < 1 ? `${Math.round(miles * 10) / 10} mi` : `${Math.round(miles)} mi`;
};

const buildAddress = (tags: Record<string, string> = {}) => {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:city'],
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : tags.operator || 'Address not available';
};

const buildOverpassQuery = (lat: number, lng: number, type: 'medical' | 'restroom') => {
  const radius = 10000;
  const filters = type === 'medical'
    ? [
        'node["amenity"~"hospital|pharmacy|clinic|doctors"](around:RADIUS,LAT,LNG);',
        'way["amenity"~"hospital|pharmacy|clinic|doctors"](around:RADIUS,LAT,LNG);',
        'relation["amenity"~"hospital|pharmacy|clinic|doctors"](around:RADIUS,LAT,LNG);',
        'node["healthcare"](around:RADIUS,LAT,LNG);',
        'way["healthcare"](around:RADIUS,LAT,LNG);',
        'relation["healthcare"](around:RADIUS,LAT,LNG);',
      ]
    : [
        'node["amenity"="toilets"](around:RADIUS,LAT,LNG);',
        'way["amenity"="toilets"](around:RADIUS,LAT,LNG);',
        'relation["amenity"="toilets"](around:RADIUS,LAT,LNG);',
        'node["toilets:disposal"](around:RADIUS,LAT,LNG);',
        'way["toilets:disposal"](around:RADIUS,LAT,LNG);',
        'relation["toilets:disposal"](around:RADIUS,LAT,LNG);',
      ];

  const body = filters
    .join('\n')
    .replaceAll('RADIUS', String(radius))
    .replaceAll('LAT', String(lat))
    .replaceAll('LNG', String(lng));

  return `
    [out:json][timeout:25];
    (
      ${body}
    );
    out center tags 60;
  `;
};

const RecenterMap = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], 14);
  }, [center, map]);

  return null;
};

const SimpleMap = ({ type, userLocation, restrooms = [], onPlacesLoaded, onPlacesError }: SimpleMapProps) => {
  const [searching, setSearching] = useState(false);
  const lastSearchKey = useRef('');

  const center = useMemo(
    () => userLocation || restrooms[0]?.location || { lat: 12.936, lng: 77.498 },
    [restrooms, userLocation]
  );

  useEffect(() => {
    if (!userLocation) {
      return;
    }

    const searchKey = `${type}-${userLocation.lat.toFixed(5)}-${userLocation.lng.toFixed(5)}`;
    if (lastSearchKey.current === searchKey) {
      return;
    }

    lastSearchKey.current = searchKey;
    setSearching(true);

    const controller = new AbortController();
    const query = buildOverpassQuery(userLocation.lat, userLocation.lng, type);

    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      signal: controller.signal,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`OpenStreetMap search failed with status ${response.status}`);
        }

        return response.json() as Promise<{ elements: OverpassElement[] }>;
      })
      .then((data) => {
        const places = data.elements
          .map((element): MapPlace | null => {
            const lat = element.lat ?? element.center?.lat;
            const lng = element.lon ?? element.center?.lon;

            if (lat === undefined || lng === undefined) {
              return null;
            }

            const tags = element.tags || {};
            const fallbackName = type === 'medical' ? 'Medical facility' : 'Public restroom';

            return {
              id: `${element.type}-${element.id}`,
              name: tags.name || tags.brand || fallbackName,
              address: buildAddress(tags),
              distance: calculateDistance(userLocation.lat, userLocation.lng, lat, lng),
              rating: 0,
              isOpen: true,
              phone: tags.phone || tags['contact:phone'],
              location: { lat, lng },
            };
          })
          .filter((place): place is MapPlace => Boolean(place))
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

        onPlacesLoaded?.(places);

        if (places.length === 0) {
          onPlacesError?.(`No nearby ${type === 'medical' ? 'medical facilities' : 'restrooms'} found in OpenStreetMap.`);
        }
      })
      .catch((error: Error) => {
        if (error.name !== 'AbortError') {
          onPlacesError?.(error.message);
        }
      })
      .finally(() => {
        setSearching(false);
      });

    return () => {
      controller.abort();
    };
  }, [onPlacesError, onPlacesLoaded, type, userLocation]);

  return (
    <div className="h-64 rounded-lg overflow-hidden relative mb-6 border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <RecenterMap center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={8}
            pathOptions={{
              color: '#ffffff',
              fillColor: '#3b82f6',
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Popup>Your location</Popup>
          </CircleMarker>
        )}

        {restrooms.map((place) => (
          <CircleMarker
            key={place.id}
            center={[place.location.lat, place.location.lng]}
            radius={7}
            pathOptions={{
              color: '#ffffff',
              fillColor: type === 'medical' ? '#8b5cf6' : '#f97316',
              fillOpacity: 1,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.address}
              <br />
              {place.distance}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {searching && (
        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-xs rounded-md px-3 py-2 flex items-center gap-2 shadow">
          <Loader2 className="h-3 w-3 animate-spin" />
          Searching OpenStreetMap
        </div>
      )}

      <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm text-xs rounded-md px-3 py-2 flex items-center gap-2 shadow">
        <MapPin className="h-3 w-3" />
        OpenStreetMap + Leaflet
      </div>
    </div>
  );
};

export default SimpleMap;
