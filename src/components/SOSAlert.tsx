import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Contact } from './EmergencyContacts';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SOSAlertProps {
  contacts: Contact[];
}

interface SendResult {
  contact: Contact;
  success: boolean;
  error?: string;
}

const SOSAlert: React.FC<SOSAlertProps> = ({ contacts }) => {
  const [isActive, setIsActive] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [failedContacts, setFailedContacts] = useState<Contact[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sendResults, setSendResults] = useState<SendResult[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const response = await fetch('/api/health-check');
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const sendSOSAlert = async (position: GeolocationPosition) => {
    try {
      console.log('Attempting to send SOS alert to backend');

      // Check network status before sending
      const isNetworkAvailable = await checkNetworkStatus();
      if (!isNetworkAvailable) {
        console.error('Network connection unavailable');
        throw new Error('Network connection unavailable');
      }

      // Validate that we have at least one contact
      if (!contacts || contacts.length === 0) {
        console.error('No emergency contacts configured');
        throw new Error('Please add at least one emergency contact before triggering SOS');
      }

      // Validate all phone numbers before sending
      const phoneRegex = /^\+?[0-9]{7,15}$/;
      const validatedContacts = contacts.map(contact => {
        const cleanedPhone = contact.phone.replace(/[^0-9+]/g, '');
        if (!phoneRegex.test(cleanedPhone) || (cleanedPhone.includes('+') && !cleanedPhone.startsWith('+'))) {
          throw new Error(`Invalid phone number format for ${contact.name}. Please use digits only with an optional leading +`);
        }
        return {
          ...contact,
          phone: cleanedPhone
        };
      });

      const requestBody = {
        contacts: validatedContacts,
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        message: '🚨 Emergency SOS Alert'
      };

      console.log('Sending SOS request to backend:', requestBody);

      const response = await fetch('/api/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Received response status:', response.status);

      // Check if response is empty
      const text = await response.text();
      console.log('Raw response:', text);

      if (!text) {
        console.error('Empty response from server');
        throw new Error('Empty response from server. Please check if the server is running and properly configured.');
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed response:', data);
      } catch (e) {
        console.error('Failed to parse response:', text);
        throw new Error('Invalid response from server. Please check the server logs for more information.');
      }

      if (!response.ok) {
        console.error('Response not OK:', {
          status: response.status,
          data: data
        });
        throw new Error(data.message || `Failed to send SOS alert. Server returned status ${response.status}`);
      }

      if (!data.success) {
        console.error('Response indicates failure:', data);
        throw new Error(data.message || 'SOS alert sending failed');
      }

      console.log('SOS alert sent successfully to backend');
      return { success: true };
    } catch (error: any) {
      console.error('Error sending SOS alert:', {
        error: error.message,
        stack: error.stack
      });
      return { 
        success: false, 
        error: error.message || 'Unknown error occurred while sending SOS alert'
      };
    }
  };

  const handleSOS = async () => {
    if (!isOnline) {
      toast({
        title: "No Internet Connection",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!isActive) {
      setIsActive(true);
      setIsSending(true);
      setFailedContacts([]);
      setSendResults([]);
      
      // Get current location
      if (!navigator.geolocation) {
        toast({
          title: "Location Not Supported",
          description: "Your browser does not support location services.",
          variant: "destructive",
        });
        setIsSending(false);
        setIsActive(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLocation(position);
          
          // Send SOS alert to backend (single request for all contacts)
          const result = await sendSOSAlert(position);

          if (result.success) {
            // All contacts notified successfully
            setSendResults(
              contacts.map(contact => ({
                contact,
                success: true
              }))
            );
            
            toast({
              title: "SOS sent successfully",
              description: "All emergency contacts have been notified with your location.",
            });
          } else {
            // SOS alert failed
            setSendResults(
              contacts.map(contact => ({
                contact,
                success: false,
                error: result.error
              }))
            );
            
            setFailedContacts(contacts);
            
            toast({
              title: "Failed to send SOS",
              description: result.error || "Could not send SOS alert. Please try again.",
              variant: "destructive",
            });
          }
          
          setIsSending(false);
        },
        (error) => {
          console.error('Error getting location:', error);

          const locationErrorMessage = error?.message || 'Unable to get your location.';
          const locationErrorTitle =
            error?.code === 1 ? 'Location Permission Denied' :
            error?.code === 2 ? 'Location Unavailable' :
            error?.code === 3 ? 'Location Request Timed Out' :
            'Location Error';

          // For permission denied, offer to continue without location
          if (error?.code === 1) {
            toast({
              title: locationErrorTitle,
              description: "Location access denied. Would you like to send SOS without location data?",
              variant: "destructive",
              action: {
                altText: "Send without location",
                onClick: async () => {
                  // Send SOS without location data
                  const mockPosition = {
                    coords: {
                      latitude: 0,
                      longitude: 0,
                      accuracy: 0,
                      altitude: null,
                      altitudeAccuracy: null,
                      heading: null,
                      speed: null
                    },
                    timestamp: Date.now()
                  };

                  const result = await sendSOSAlert(mockPosition);

                  if (result.success) {
                    setSendResults(
                      contacts.map(contact => ({
                        contact,
                        success: true
                      }))
                    );

                    toast({
                      title: "SOS sent successfully",
                      description: "Emergency contacts notified (location not available).",
                    });
                  } else {
                    setSendResults(
                      contacts.map(contact => ({
                        contact,
                        success: false,
                        error: result.error
                      }))
                    );

                    setFailedContacts(contacts);

                    toast({
                      title: "Failed to send SOS",
                      description: result.error || "Could not send SOS alert. Please try again.",
                      variant: "destructive",
                    });
                  }

                  setIsSending(false);
                }
              }
            });
          } else {
            toast({
              title: locationErrorTitle,
              description: locationErrorMessage,
              variant: "destructive",
            });
            setIsSending(false);
            setIsActive(false);
          }
        }
      );
      
      // Automatically deactivate after 5 minutes
      setTimeout(() => {
        setIsActive(false);
        setLocation(null);
      }, 300000);
    } else {
      setIsActive(false);
      setLocation(null);
    }
  };

  return (
    <div className={`rounded-lg p-6 mb-6 text-center ${
      isActive ? 'bg-red-100 animate-pulse' : 'bg-empowerHer-lightCoral'
    }`}>
      <Button
        onClick={handleSOS}
        disabled={isSending || !isOnline}
        className={`w-32 h-32 rounded-full transition-all duration-300 ${
          isActive 
            ? 'bg-red-600 hover:bg-red-700 scale-110' 
            : 'bg-empowerHer-purple hover:bg-empowerHer-purple/90'
        }`}
      >
        <div className="flex flex-col items-center">
          {!isOnline && <WifiOff className="h-6 w-6 mb-2 text-red-500" />}
          <AlertTriangle className="h-8 w-8 mb-2" />
          <span className="text-lg font-semibold">
            {isSending ? 'SENDING...' : isActive ? 'ACTIVE' : 'SOS'}
          </span>
        </div>
      </Button>
      
      <div className="mt-4">
        <p className="font-medium">
          {!isOnline 
            ? 'No Internet Connection - Please check your network'
            : isActive 
              ? 'SOS Alert is Active - Help is on the way!' 
              : 'Press the button in case of emergency'
          }
        </p>
        {location && (
          <p className="text-sm mt-2">
            Location shared: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
          </p>
        )}
        {failedContacts.length > 0 && (
          <div className="mt-4 text-sm text-red-600">
            <p className="font-medium">Failed to notify:</p>
            <ul className="list-disc list-inside">
              {failedContacts.map((contact, index) => (
                <li key={contact.id}>
                  {contact.name} ({contact.phone})
                  {sendResults[index]?.error && (
                    <span className="block text-xs text-red-400">
                      Error: {sendResults[index].error}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSAlert;
