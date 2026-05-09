import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, MapPin, BookOpen, User, Moon, Sun, Sparkles, History, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="relative group">
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 backdrop-blur-sm ${
          isActive 
            ? 'bg-gradient-to-r from-empowerHer-primary/20 to-empowerHer-accent1/20 text-empowerHer-primary shadow-lg border border-empowerHer-primary/30' 
            : 'hover:bg-gradient-to-r hover:from-empowerHer-primary/10 hover:to-empowerHer-accent1/10 text-muted-foreground hover:text-empowerHer-primary border border-transparent hover:border-empowerHer-primary/20'
        }`}
      >
        {icon}
        <span className="text-sm font-semibold">{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-empowerHer-primary/10 to-empowerHer-accent1/10 -z-10"
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
      className="fixed bottom-8 right-8 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="glass-card p-4 rounded-2xl transition-all duration-300 hover:shadow-xl border border-empowerHer-primary/20 hover:border-empowerHer-primary/40 group"
      >
        <motion.div
          animate={{ rotate: theme === 'dark' ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'light' ? (
            <Sun className="h-6 w-6 text-empowerHer-primary group-hover:text-empowerHer-secondary transition-colors" />
          ) : (
            <Moon className="h-6 w-6 text-empowerHer-accent1 group-hover:text-empowerHer-primary transition-colors" />
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-empowerHer-primary/10 backdrop-blur-xl"
      >
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="p-3 rounded-2xl bg-gradient-to-r from-empowerHer-primary to-empowerHer-accent1 shadow-lg"
              >
                <Sparkles className="h-6 w-6 text-white sparkles-shine" aria-hidden="true" />
              </motion.div>
              <span className="text-2xl font-bold gradient-text">
                Empower Her
              </span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/" icon={<Home className="h-4 w-4" />} label="Home" />
              <NavLink to="/sos" icon={<MapPin className="h-4 w-4" />} label="SOS" />
              <NavLink to="/sos-history" icon={<History className="h-4 w-4" />} label="SOS History" />
              <NavLink to="/medical" icon={<MapPin className="h-4 w-4" />} label="Medical" />
              <NavLink to="/restrooms" icon={<MapPin className="h-4 w-4" />} label="Restrooms" />
              <NavLink to="/resources" icon={<BookOpen className="h-4 w-4" />} label="Resources" />
              <NavLink to="/profile" icon={<User className="h-4 w-4" />} label="Profile" />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-xl hover:bg-empowerHer-primary/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-40 glass-card border-b border-empowerHer-primary/10 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto py-4 space-y-2">
              <MobileNavLink to="/" icon={<Home className="h-5 w-5" />} label="Home" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/sos" icon={<MapPin className="h-5 w-5" />} label="SOS" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/sos-history" icon={<History className="h-5 w-5" />} label="SOS History" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/medical" icon={<MapPin className="h-5 w-5" />} label="Medical" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/restrooms" icon={<MapPin className="h-5 w-5" />} label="Restrooms" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/resources" icon={<BookOpen className="h-5 w-5" />} label="Resources" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/profile" icon={<User className="h-5 w-5" />} label="Profile" onClick={() => setMobileMenuOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ThemeToggle />
    </>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} onClick={onClick} className="block">
      <motion.div
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-r from-empowerHer-primary/20 to-empowerHer-accent1/20 text-empowerHer-primary shadow-lg border border-empowerHer-primary/30' 
            : 'hover:bg-gradient-to-r hover:from-empowerHer-primary/10 hover:to-empowerHer-accent1/10 text-muted-foreground hover:text-empowerHer-primary border border-transparent hover:border-empowerHer-primary/20'
        }`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </motion.div>
    </Link>
  );
};

export default Navbar;
