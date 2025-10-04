import React from "react";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-500 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <h2 className="text-2xl lg:text-3xl font-bold">
            Koerier nodig?
            <span className="block text-green-100">Direct ophalen binnen 45 min.</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-green-600"
            >
              Offerte aanvragen
            </Button>
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              Direct verzenden
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-green-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Direct online boeken</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Op rekening mogelijk</span>
            </div>
          </div>

          <div className="border-t border-green-400 pt-6">
            <p className="text-sm text-green-100">
              Start een WhatsApp gesprek met onze klantenservice
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;