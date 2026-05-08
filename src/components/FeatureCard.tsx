
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  color: 'purple' | 'coral' | 'teal';
}

const FeatureCard = ({ icon, title, description, linkTo, color }: FeatureCardProps) => {
  const colorClasses = {
    purple: {
      bg: 'bg-empowerHer-lightPurple',
      text: 'text-empowerHer-purple',
      hover: 'hover:bg-empowerHer-purple'
    },
    coral: {
      bg: 'bg-empowerHer-lightCoral',
      text: 'text-empowerHer-coral',
      hover: 'hover:bg-empowerHer-coral'
    },
    teal: {
      bg: 'bg-empowerHer-lightTeal',
      text: 'text-empowerHer-teal',
      hover: 'hover:bg-empowerHer-teal'
    }
  };

  return (
    <div className="feature-card">
      <div className={`w-12 h-12 ${colorClasses[color].bg} rounded-full flex items-center justify-center mb-4`}>
        <div className={colorClasses[color].text}>{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button variant="ghost" className="p-0 gap-1 mt-2" asChild>
        <Link to={linkTo} className={`group flex items-center ${colorClasses[color].text} font-medium`}>
          Access Now
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
};

export default FeatureCard;
