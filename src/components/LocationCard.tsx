import React from 'react';
import { MapPin, Star, Clock, Phone, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LocationCardProps {
  name: string;
  address: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  phone?: string;
  type: 'medical' | 'restroom';
  hygiene?: number;
  accessibility?: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}

const LocationCard = ({ 
  name, 
  address, 
  distance, 
  rating, 
  isOpen, 
  phone, 
  type,
  hygiene,
  accessibility,
  location
}: LocationCardProps) => {
  const handleGetDirections = () => {
    if (location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&destination_place_id=${encodeURIComponent(name)}`;
      window.open(url, '_blank');
    } else {
      // Fallback to address-based navigation if coordinates aren't available
      const encodedAddress = encodeURIComponent(`${name} ${address}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  return (
    <div className="feature-card h-[280px] flex flex-col justify-between bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold line-clamp-2">{name}</h3>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs font-medium shrink-0 ml-2">
            <MapPin className="h-3 w-3" />
            {distance}
          </div>
        </div>
        
        <div className="flex items-center mt-1 mb-3">
          <div className="flex items-center gap-1 mr-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
          <div className={`text-xs px-2 py-0.5 rounded-full ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isOpen ? 'Open now' : 'Closed'}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex items-start">
          <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
          {address}
        </p>
        
        {type === 'medical' && phone && (
          <p className="text-sm text-muted-foreground mb-3 flex items-center">
            <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
            {phone}
          </p>
        )}
        
        {type === 'restroom' && (
          <div className="mb-3">
            {hygiene !== undefined && (
              <div className="flex items-center mt-1 mb-1">
                <span className="text-sm mr-2">Hygiene Rating:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= hygiene ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            {accessibility !== undefined && (
              <div className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 inline-block">
                {accessibility ? 'Wheelchair Accessible' : 'Not Accessible'}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 hover:bg-empowerHer-primary/10 hover:text-empowerHer-primary transition-colors"
          onClick={handleGetDirections}
        >
          <ExternalLink className="h-4 w-4" />
          Get Directions
        </Button>
      </div>
    </div>
  );
};

export default LocationCard;
