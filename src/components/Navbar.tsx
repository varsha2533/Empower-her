import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, MapPin, BookOpen, User, Moon, Sun, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="relative group">
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
          isActive 
            ? 'bg-empowerHer-primary/10 text-empowerHer-primary shadow-sm' 
            : 'hover:bg-empowerHer-accent1/20 text-muted-foreground'
        }`}
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-empowerHer-gradient-start to-empowerHer-gradient-end rounded-full"
          />
        )}
      </motion.div>
    </Link>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.05, rotate: 15 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="glass-card p-3 rounded-full transition-all duration-300 hover:shadow-lg"
      >
        {theme === 'light' ? (
          <Sun className="h-5 w-5 text-empowerHer-primary" />
        ) : (
          <Moon className="h-5 w-5 text-empowerHer-accent1" />
        )}
      </motion.button>
    </motion.div>
  );
};

const Navbar = () => {
  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-card/90 backdrop-blur-lg shadow-sm"
      >
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="h-8 w-8 text-empowerHer-accent1 sparkles-shine" aria-hidden="true" />
              <span className="text-3xl font-bold gradient-text">
                Empower Her
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <NavLink to="/" icon={<Home className="h-4 w-4" />} label="Home" />
              <NavLink to="/sos" icon={<MapPin className="h-4 w-4" />} label="SOS" />
              <NavLink to="/medical" icon={<MapPin className="h-4 w-4" />} label="Medical" />
              <NavLink to="/restrooms" icon={<MapPin className="h-4 w-4" />} label="Restrooms" />
              <NavLink to="/resources" icon={<BookOpen className="h-4 w-4" />} label="Resources" />
              <NavLink to="/profile" icon={<User className="h-4 w-4" />} label="Profile" />
            </div>
          </div>
        </div>
      </motion.nav>
      <ThemeToggle />
    </>
  );
};

export default Navbar;
