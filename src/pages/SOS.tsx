import React, { useState, useEffect } from 'react';
import { Phone, MapPin, BellRing } from 'lucide-react';
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
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Emergency SOS</h1>
        <p className="text-muted-foreground">
          Activate SOS to alert your emergency contacts and share your location. Use this feature in situations where you feel unsafe or need immediate assistance.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <SOSAlert contacts={contacts} />
          
          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={handleEmergencyCall}
          >
            <Phone className="mr-2 h-4 w-4" />
            Call Emergency Services (911)
          </Button>
        </div>

        <div className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <BellRing className="mr-2 h-4 w-4" />
                Manage Emergency Contacts
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Emergency Contacts</DialogTitle>
              </DialogHeader>
              <EmergencyContacts
                contacts={contacts}
                onAddContact={handleAddContact}
                onRemoveContact={handleRemoveContact}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="w-full">
            <MapPin className="mr-2 h-4 w-4" />
            Set Safe Locations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SOSPage;
