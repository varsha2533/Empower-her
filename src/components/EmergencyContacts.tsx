import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface EmergencyContactsProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onRemoveContact: (id: string) => void;
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({
  contacts,
  onAddContact,
  onRemoveContact,
}) => {
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Phone number validation for any international number
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    const cleanedPhone = newContact.phone.replace(/[^0-9+]/g, '');
    if (!phoneRegex.test(cleanedPhone) || (cleanedPhone.includes('+') && !cleanedPhone.startsWith('+'))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with digits and optional leading +",
        variant: "destructive",
      });
      return;
    }

    onAddContact({
      ...newContact,
      phone: cleanedPhone // Store the cleaned phone number
    });
    setNewContact({ name: '', phone: '', relationship: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Contact name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+17542882992"
              type="tel"
            />
            <p className="text-xs text-muted-foreground">Format: digits only, optional leading +</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              value={newContact.relationship}
              onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
              placeholder="Family member, friend, etc."
            />
          </div>
          
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Saved Contacts</h4>
        {contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No emergency contacts added yet.</p>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveContact(contact.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts; 