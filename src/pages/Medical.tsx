import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SimpleMap from '@/components/SimpleMap';
import LocationCard from '@/components/LocationCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Locate, MapPin, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface MedicalFacility {
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

const MedicalPage = () => {
  const [medicalFacilities, setMedicalFacilities] = useState<MedicalFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedFacility, setHighlightedFacility] = useState<string | null>(null);

  useEffect(() => {
    // Highlight the closest facility when facilities are loaded
    if (medicalFacilities.length > 0) {
      setHighlightedFacility(medicalFacilities[0].id);
    }
  }, [medicalFacilities]);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive"
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const filteredFacilities = medicalFacilities.filter(facility => 
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header 
        title="Medical Shops" 
        description="Find nearby medical shops and pharmacies with essential supplies."
      />
      
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-xl mx-auto mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search for medical shops..." 
            className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <Filter className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-empowerHer-purple" />
            Nearby Medical Shops
          </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center gap-1"
              onClick={getCurrentLocation}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              ) : (
                <Locate className="h-3 w-3 text-muted-foreground" />
              )}
            Use Current Location
          </Button>
        </div>
        
          {userLocation && (
            <SimpleMap
              type="medical"
              userLocation={userLocation}
              restrooms={medicalFacilities}
              onPlacesLoaded={(places) => {
                setMedicalFacilities(places);
                setLoading(false);
              }}
              onPlacesError={(message) => {
                toast({
                  title: message.includes('REQUEST_DENIED') ? "API Error" : "Places Search",
                  description: message.includes('REQUEST_DENIED')
                    ? "Access to the Places API was denied. Check key restrictions and make sure the Places library is enabled."
                    : message,
                  variant: message.includes('REQUEST_DENIED') ? "destructive" : "default"
                });
                setLoading(false);
              }}
            />
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-empowerHer-purple" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`transform transition-all duration-300 hover:scale-105 ${
                  highlightedFacility === facility.id 
                    ? 'ring-2 ring-empowerHer-purple ring-offset-2 shadow-lg scale-105' 
                    : ''
                }`}
              >
            <LocationCard 
              type="medical"
                  name={facility.name}
                  address={facility.address}
                  distance={facility.distance}
                  rating={facility.rating}
                  isOpen={facility.isOpen}
                  phone={facility.phone}
                  location={facility.location}
                />
              </motion.div>
            ))}
            {filteredFacilities.length === 0 && !loading && (
              <div className="col-span-3 text-center text-muted-foreground py-8">
                No medical facilities found. Try adjusting your search or location.
              </div>
            )}
        </div>
        )}
      </div>
    </>
  );
};

export default MedicalPage;
