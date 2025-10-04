import React, { useState } from "react";
import { Phone, ChevronDown, User, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-green-500 text-white px-3 py-2 rounded-lg font-bold text-xl">
              123
            </div>
            <span className="ml-2 font-bold text-gray-800 text-xl">GELEVERD</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center text-green-600 font-medium">
              <Phone className="w-4 h-4 mr-2" />
              <span>085 760 92 08</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
                <span>Onze diensten</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <button className="text-gray-700 hover:text-green-600 transition-colors">
                Track & Trace
              </button>
            </div>

            <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2">
              Bereken je transport →
            </Button>

            <button className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
              <User className="w-4 h-4 mr-2" />
              <span>Inloggen</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="space-y-4">
              <div className="flex items-center text-green-600 font-medium">
                <Phone className="w-4 h-4 mr-2" />
                <span>085 760 92 08</span>
              </div>
              <button className="block text-gray-700 hover:text-green-600 transition-colors">
                Onze diensten
              </button>
              <button className="block text-gray-700 hover:text-green-600 transition-colors">
                Track & Trace
              </button>
              <Button className="bg-green-500 hover:bg-green-600 text-white w-full">
                Bereken je transport →
              </Button>
              <button className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
                <User className="w-4 h-4 mr-2" />
                <span>Inloggen</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;