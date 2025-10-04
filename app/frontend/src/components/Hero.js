import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { CheckCircle, Clock, Shield, MapPin } from "lucide-react";
import PriceCalculator from "./PriceCalculator";

const Hero = () => {
  return (
    <section className="bg-green-500 min-h-[600px] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Calculator Form */}
          <div className="space-y-8">
            <PriceCalculator />
          </div>

          {/* Right Column - Content and Image */}
          <div className="text-white space-y-8">
            <div className="inline-block">
              <span className="bg-green-400 text-green-50 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Direct een koerier beschikbaar
              </span>
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Koeriersdienst
                <br />
                <span className="text-green-100">door heel Nederland</span>
              </h1>
              
              <p className="text-lg text-green-50 mb-6">
                Direct een koerier beschikbaar voor jouw zending.
                <br />
                Boek direct of reserveer vooruit - altijd beschikbaar.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-green-200" />
                <span className="text-green-50">Binnen 45 minuten op locatie</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-200" />
                <span className="text-green-50">Altijd verzekerd transport</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-200" />
                <span className="text-green-50">Achteraf betalen mogelijk</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-200" />
                <span className="text-green-50">Track & trace inbegrepen</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 flex items-center space-x-2">
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f39c12'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E" 
                  alt="star" 
                  className="w-4 h-4" 
                />
                <span className="font-bold text-green-600">9.2</span>
              </div>
              <span className="text-green-100 text-sm">19+ reviews</span>
            </div>

            {/* Delivery Van Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1569850402748-11f762e9be07?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHx2YW58ZW58MHx8fHdoaXRlfDE3NTk0Mzk0OTl8MA&ixlib=rb-4.1.0&q=85"
                alt="Delivery van"
                className="w-full max-w-md ml-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md">
          <div className="flex items-center space-x-3 text-green-50">
            <CheckCircle className="w-5 h-5 text-green-200" />
            <span>Spoed of gepland mogelijk</span>
          </div>
          <div className="flex items-center space-x-3 text-green-50">
            <Clock className="w-5 h-5 text-green-200" />
            <span>In 2 minuten geregeld</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;