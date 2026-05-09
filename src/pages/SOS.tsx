import React, { useState, useEffect } from 'react';
import { Phone, MapPin, BellRing, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SOSAlert from '@/components/SOSAlert';
import EmergencyContacts, { Contact } from '@/components/EmergencyContacts';
import { toast } from '@/hooks/use-toast';

const SOSPage = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('emergencyContacts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = (newContact: Omit<Contact, 'id'>) => {
    const contact: Contact = {
      ...newContact,
      id: Date.now().toString(),
    };
    setContacts(prev => [...prev, contact]);
    toast({
      title: "Contact Added",
      description: "Emergency contact has been added successfully.",
    });
  };

  const handleRemoveContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed.",
    });
  };

  const handleEmergencyCall = () => {
    // This is just a demonstration. In a real app, you'd use a proper phone API
    window.location.href = 'tel:911';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-lavender via-calm-softWhite to-calm-paleBlue dark:from-calm-deepNavy dark:via-calm-slate dark:to-calm-deepNavy">
      <div className="container max-w-6xl mx-auto p-4 py-8 space-y-8">
        {/* Header Section */}
        <header className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-empowerHer-primary to-empowerHer-accent1 shadow-lg">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-empowerHer-primary via-empowerHer-secondary to-empowerHer-accent1 bg-clip-text text-transparent">
            Emergency SOS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Activate SOS to alert your emergency contacts and share your location. Use this feature in situations where you feel unsafe or need immediate assistance.
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 items-stretch">
          {/* SOS Alert Section */}
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-empowerHer-primary/20">
              <SOSAlert contacts={contacts} />
            </div>
            
            {/* Emergency Call Button */}
            <Button
              onClick={handleEmergencyCall}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Phone className="mr-3 h-5 w-5" />
              Call Emergency Services (911)
            </Button>
          </div>

          {/* Controls Section */}
          <div className="flex items-center justify-center h-full">
            <div className="space-y-6 w-full max-w-sm">
              {/* Emergency Contacts */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-empowerHer-primary to-empowerHer-secondary hover:from-empowerHer-primary/90 hover:to-empowerHer-secondary/90 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                    <BellRing className="mr-3 h-5 w-5" />
                    Manage Emergency Contacts
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-empowerHer-primary/20">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-empowerHer-primary to-empowerHer-accent1 bg-clip-text text-transparent">
                      Emergency Contacts
                    </DialogTitle>
                  </DialogHeader>
                  <EmergencyContacts
                    contacts={contacts}
                    onAddContact={handleAddContact}
                    onRemoveContact={handleRemoveContact}
                  />
                </DialogContent>
              </Dialog>

              {/* Safe Locations */}
              <Button className="w-full h-16 rounded-2xl bg-white dark:bg-card border-2 border-empowerHer-primary/20 hover:border-empowerHer-primary/40 text-empowerHer-primary font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                <MapPin className="mr-3 h-5 w-5" />
                Set Safe Locations
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSPage;
