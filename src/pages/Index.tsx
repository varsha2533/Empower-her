import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Heart, Shield, Phone } from 'lucide-react';

const backgroundGradients = [
  "bg-gradient-to-br from-rose-400/20 via-purple-400/20 to-indigo-400/20",
  "bg-gradient-to-br from-blue-400/20 via-teal-400/20 to-emerald-400/20",
  "bg-gradient-to-br from-violet-400/20 via-pink-400/20 to-rose-400/20",
  "bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-purple-400/20",
  "bg-gradient-to-br from-fuchsia-400/20 via-purple-400/20 to-indigo-400/20"
];

const Index = () => {
  const [currentGradient, setCurrentGradient] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % backgroundGradients.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGradient}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className={`absolute inset-0 ${backgroundGradients[currentGradient]}`}
        />
      </AnimatePresence>

      <div className="absolute inset-0 backdrop-blur-[100px]" />

      <div className="relative">
        <div className="container mx-auto px-4 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-empowerHer-primary via-empowerHer-accent1 to-empowerHer-secondary"
            >
              Your Safe Space for Support & Growth
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Empowering women through community support, safety resources, and essential services.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="bg-empowerHer-primary hover:bg-empowerHer-primary/90"
                onClick={() => navigate('/profile')}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-empowerHer-primary text-empowerHer-primary hover:bg-empowerHer-primary/10"
                onClick={() => navigate('/resources')}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Services Section */}
        <section className="container mx-auto px-4 mb-16 relative z-10 mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Essential Services</h2>
            <p className="text-muted-foreground">Supporting your safety and well-being</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center"
            >
              <Shield className="w-12 h-12 mx-auto mb-4 text-empowerHer-purple" />
              <h3 className="text-xl font-semibold mb-2">Emergency Support</h3>
              <p className="text-muted-foreground mb-4">24/7 access to emergency services and support networks</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/sos">Learn More</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center"
            >
              <Heart className="w-12 h-12 mx-auto mb-4 text-empowerHer-coral" />
              <h3 className="text-xl font-semibold mb-2">Health Resources</h3>
              <p className="text-muted-foreground mb-4">Access to medical facilities and health information</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/medical">Learn More</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center"
            >
              <MapPin className="w-12 h-12 mx-auto mb-4 text-empowerHer-teal" />
              <h3 className="text-xl font-semibold mb-2">Hygienic Washrooms</h3>
              <p className="text-muted-foreground mb-4">Find clean and safe washroom facilities near you</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/restrooms">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Community Section */}
        <section className="container mx-auto px-4 mb-16 relative z-10">
          <div className="glass-card p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                <p className="text-muted-foreground mb-6">
                  Connect with a supportive network of women who understand and empower each other.
                </p>
                <Button className="bg-empowerHer-coral hover:bg-empowerHer-coral/90">
                  Join Now
                </Button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                  <h3 className="text-2xl font-bold text-empowerHer-purple">1000+</h3>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                  <h3 className="text-2xl font-bold text-empowerHer-coral">24/7</h3>
                  <p className="text-sm text-muted-foreground">Support Available</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                  <h3 className="text-2xl font-bold text-empowerHer-teal">500+</h3>
                  <p className="text-sm text-muted-foreground">Safe Locations</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                  <h3 className="text-2xl font-bold text-empowerHer-purple">100%</h3>
                  <p className="text-sm text-muted-foreground">Safe & Secure</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 pb-16 relative z-10">
          <div className="glass-card max-w-3xl mx-auto p-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Get Help Now</h2>
            <p className="text-muted-foreground mb-6">We're here to support you 24/7</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="w-full sm:w-auto bg-empowerHer-purple hover:bg-empowerHer-purple/90" asChild>
                <Link to="/sos" className="inline-flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Contact
                </Link>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/resources" className="inline-flex items-center justify-center">
                  Resources
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
