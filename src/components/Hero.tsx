
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, MapPin, Briefcase, Zap, BrainCircuit, Box, Cube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    <section className="relative py-24 mt-10 overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 bg-accent/5 w-[800px] h-[800px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 bg-secondary w-[600px] h-[600px] rounded-full -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/4 left-1/4 bg-primary/5 w-[300px] h-[300px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="inline-flex items-center bg-accent/10 text-accent rounded-full px-3 py-1 text-sm font-medium mb-6"
          >
            <span className="animate-pulse-subtle">Revolutionizing job search</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance"
          >
            Discover Your Dream Career With <span className="text-accent">AI-Powered</span> Precision
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto text-balance"
          >
            Nexify uses cutting-edge AI, blockchain verification and AR interview technology to match your skills with the perfect opportunities, elevating your career journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <SearchBar />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>10,000+ jobs available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>Remote & in-office opportunities</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Search className="h-4 w-4" />
              <span>AI-powered matching</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full"
          >
            <div className="neo-blur rounded-xl p-5 flex flex-col items-center text-center card-hover">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <BrainCircuit className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium mb-1">AI Matching</h3>
              <p className="text-sm text-muted-foreground">Smart algorithms that understand your true potential</p>
            </div>
            <div className="neo-blur rounded-xl p-5 flex flex-col items-center text-center card-hover">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Cube className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium mb-1">AR/VR Interviews</h3>
              <p className="text-sm text-muted-foreground">Practice and perform in immersive environments</p>
            </div>
            <div className="neo-blur rounded-xl p-5 flex flex-col items-center text-center card-hover">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-medium mb-1">Blockchain Verified</h3>
              <p className="text-sm text-muted-foreground">Secure, transparent credential verification</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto"
        >
          {['Tesla', 'Microsoft', 'Google', 'Amazon', 'Apple', 'Meta'].map((company, index) => (
            <motion.div 
              key={company}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 + index * 0.1, duration: 0.5 }}
              className="flex items-center justify-center h-12 neo-blur rounded-lg text-muted-foreground font-medium animate-float"
            >
              {company}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
