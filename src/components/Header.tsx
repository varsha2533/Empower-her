import React from 'react';
import { MapPin, ShieldAlert, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  title: string;
  description: string;
}

const Header = ({ title, description }: HeaderProps) => {
  const location = useLocation();
  
  const getIcon = () => {
    switch (location.pathname) {
      case '/medical':
        return <MapPin className="h-6 w-6 text-empowerHer-purple" />;
      case '/restrooms':
        return <MapPin className="h-6 w-6 text-empowerHer-coral" />;
      case '/resources':
        return <BookOpen className="h-6 w-6 text-empowerHer-teal" />;
      case '/sos':
        return <ShieldAlert className="h-6 w-6 text-empowerHer-purple" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-8 text-center">
      <div className="flex flex-col items-center gap-2 mb-2">
        {getIcon()}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
    </div>
  );
};

export default Header;
