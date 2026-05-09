import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { Contact } from './EmergencyContacts';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/**
 * SOSAlert Component
 * 
 * Main emergency SOS button component that:
 * 1. Captures user's location (with permission)
 * 2. Sends SOS alert to backend with emergency contacts
 * 3. Displays risk assessment from FastAPI
 * 4. Shows loading state and error handling
 * 5. Maintains network status awareness
 */

interface SOSAlertProps {
  contacts: Contact[];
}

interface SendResult {
  contact: Contact;
  success: boolean;
  error?: string;
}

interface RiskData {
  riskScore: number;
  riskLevel: string;
  recommendation: string;
}

const SOSAlert: React.FC<SOSAlertProps> = ({ contacts }) => {
  // Clerk authentication
  const { user, isSignedIn } = useUser();
  
  // State management
  const [isActive, setIsActive] = useState(false);           // SOS button active state
  const [location, setLocation] = useState<GeolocationPosition | null>(null);  // User location
  const [isSending, setIsSending] = useState(false);         // Loading state during send
  const [failedContacts, setFailedContacts] = useState<Contact[]>([]);  // Contacts that failed
  const [isOnline, setIsOnline] = useState(navigator.onLine);  // Network status
  const [sendResults, setSendResults] = useState<SendResult[]>([]);  // Results of send
  const [riskData, setRiskData] = useState<RiskData | null>(null);  // Risk assessment data
  const [message, setMessage] = useState<string>('');          // Custom SOS message text
  const defaultMessage = '🚨 Emergency SOS Alert';

  /**
   * Monitor network connectivity
   * This effect listens to online/offline events to disable SOS when disconnected
   */
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

  /**
   * Check backend health/availability
   * Ensures backend is reachable before sending SOS
   */
  const checkNetworkStatus = async () => {
    try {
      const response = await fetch('/api/health-check');
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  /**
   * Send SOS Alert to Backend
   * 
   * Process:
   * 1. Validate network connectivity
   * 2. Validate emergency contacts exist
   * 3. Clean and validate phone numbers
   * 4. Send request to /api/sos endpoint
   * 5. Return risk assessment data
   */
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

      const submittedMessage = message.trim() || defaultMessage;
      const requestBody = {
        contacts: validatedContacts,
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        message: submittedMessage,
        userId: user?.id, // Add Clerk user ID
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
      return { success: true, riskData: data.riskData };
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
    // Check if user is authenticated
    if (!isSignedIn || !user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the SOS feature.",
        variant: "destructive",
      });
      return;
    }

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
            
            // Set risk data from response
            if (result.riskData) {
              setRiskData(result.riskData);
            }
            
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
        async (error) => {
          console.error('Error getting location:', error);

          const locationErrorMessage = error?.message || 'Unable to get your location.';
          const locationErrorTitle =
            error?.code === 1 ? 'Location Permission Denied' :
            error?.code === 2 ? 'Location Unavailable' :
            error?.code === 3 ? 'Location Request Timed Out' :
            'Location Error';

          // For permission denied, send SOS without location data
          if (error?.code === 1) {
            toast({
              title: locationErrorTitle,
              description: "Sending SOS alert without location data...",
              variant: "destructive",
            });

            // Create a mock position with 0,0 coordinates (location not available)
            const mockPosition = {
              coords: {
                latitude: 0 as const,
                longitude: 0 as const,
                accuracy: 0 as const,
                altitude: null as any,
                altitudeAccuracy: null as any,
                heading: null as any,
                speed: null as any,
                toJSON: function() { return this; }
              },
              timestamp: Date.now(),
              toJSON: function() { return this; }
            } as GeolocationPosition;

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
    <div className={`rounded-3xl p-8 text-center transition-all duration-500 ${
      isActive 
        ? 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 animate-sos-pulse border-2 border-red-200 dark:border-red-800' 
        : 'bg-gradient-to-br from-calm-lavender to-calm-mutedPink dark:from-calm-deepNavy dark:to-calm-slate border border-empowerHer-primary/20'
    }`}>
      {/* Message Input Section */}
      <div className="mb-6 text-left">
        <label htmlFor="sos-message" className="block text-sm font-semibold text-empowerHer-primary dark:text-empowerHer-lightPurple mb-3">
          Describe the emergency
        </label>
        <textarea
          id="sos-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Describe the emergency..."
          rows={4}
          className="w-full rounded-2xl border border-empowerHer-primary/20 bg-white/80 dark:bg-card/80 backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-empowerHer-primary focus:outline-none focus:ring-2 focus:ring-empowerHer-primary/20 transition-all duration-300"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Leave this blank to send the default emergency alert message.
        </p>
      </div>
      
      {/* Premium SOS Button */}
      <div className="relative inline-block mb-6">
        <Button
          onClick={handleSOS}
          disabled={isSending || !isOnline}
          className={`w-40 h-40 rounded-full transition-all duration-500 relative overflow-hidden group ${
            isActive 
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-sos-pulse shadow-2xl' 
              : 'bg-gradient-to-br from-empowerHer-primary to-empowerHer-accent1 hover:from-empowerHer-primary/90 hover:to-empowerHer-accent1/90 animate-premium-glow shadow-xl hover:shadow-2xl'
          } ${isSending ? 'opacity-80 cursor-wait' : ''} transform hover:scale-105 active:scale-95`}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
          
          <div className="relative flex flex-col items-center justify-center h-full">
            {!isOnline && <WifiOff className="h-8 w-8 mb-2 text-white" />}
            
            {/* Loading spinner during sending */}
            {isSending ? (
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-white border-t-transparent" />
            ) : (
              <AlertTriangle className="h-12 w-12 mb-2 text-white drop-shadow-lg" />
            )}
            
            <span className="text-xl font-bold text-white drop-shadow-md">
              {isSending ? 'SENDING...' : isActive ? 'ACTIVE' : 'SOS'}
            </span>
          </div>
        </Button>
        
        {/* Pulsing ring effect when active */}
        {isActive && (
          <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping" />
        )}
      </div>
      
      {/* Status Messages */}
      <div className="space-y-4">
        <p className="font-semibold text-empowerHer-primary dark:text-empowerHer-lightPurple">
          {!isOnline 
            ? 'No Internet Connection - Please check your network'
            : isActive 
              ? 'SOS Alert is Active - Help is on the way!' 
              : 'Press the button in case of emergency'
          }
        </p>
        
        {location && (
          <div className="bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-empowerHer-primary/20">
            <p className="text-sm font-medium text-empowerHer-primary dark:text-empowerHer-lightPurple mb-1">
              Location Shared
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
            </p>
          </div>
        )}
        
        {/* Risk Assessment Display */}
        {riskData && isActive && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-empowerHer-primary/30">
            <h3 className="text-xl font-bold text-empowerHer-primary dark:text-empowerHer-lightPurple mb-4">
              Risk Assessment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 dark:bg-card/80 rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground font-medium mb-2">Risk Score</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {riskData.riskScore.toFixed(1)}/10
                </p>
              </div>
              <div className={`rounded-2xl p-4 text-center ${
                riskData.riskLevel === 'HIGH' ? 'bg-red-100 dark:bg-red-900/30' :
                riskData.riskLevel === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                'bg-green-100 dark:bg-green-900/30'
              }`}>
                <p className="text-xs text-muted-foreground font-medium mb-2">Risk Level</p>
                <p className={`text-3xl font-bold ${
                  riskData.riskLevel === 'HIGH' ? 'text-red-600 dark:text-red-400' :
                  riskData.riskLevel === 'MEDIUM' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-green-600 dark:text-green-400'
                }`}>
                  {riskData.riskLevel}
                </p>
              </div>
            </div>
            {riskData.recommendation && (
              <div className="mt-4 bg-white/80 dark:bg-card/80 rounded-2xl p-4">
                <p className="text-xs text-muted-foreground font-medium mb-2">Recommendation</p>
                <p className="text-sm text-foreground">{riskData.recommendation}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Failed Contacts */}
        {failedContacts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-200 dark:border-red-800">
            <p className="font-semibold text-red-700 dark:text-red-400 mb-3">Failed to notify:</p>
            <ul className="space-y-2">
              {failedContacts.map((contact, index) => (
                <li key={contact.id} className="text-sm text-red-600 dark:text-red-300">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-xs">{contact.phone}</div>
                  {sendResults[index]?.error && (
                    <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                      Error: {sendResults[index].error}
                    </div>
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
