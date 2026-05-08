
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  description: string;
  tags: string[];
  link: string;
  imageUrl?: string;
}

const ResourceCard = ({ title, description, tags, link, imageUrl }: ResourceCardProps) => {
  return (
    <div className="feature-card mb-6">
      {imageUrl && (
        <div className="mb-4 w-full h-40 overflow-hidden rounded-md">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="bg-muted/50">{tag}</Badge>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={() => window.open(link, "_blank")}
      >
        <ExternalLink className="h-4 w-4" />
        View Resource
      </Button>
    </div>
  );
};

export default ResourceCard;
