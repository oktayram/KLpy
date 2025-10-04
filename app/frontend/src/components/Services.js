import React from "react";
import { FileText, Package, Truck, Thermometer, Zap, Star } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const Services = () => {
  const services = [
    {
      icon: FileText,
      title: "Documenten & Kleine pakketten",
      description: "Snelle en veilige bezorging van contracten, belangrijke papieren en kleine pakketten tot 2kg.",
      feature: "Binnen 45 minuten opgehaald"
    },
    {
      icon: Package,
      title: "Middelgrote zendingen",
      description: "Voor grotere pakketten en dozen tot 25kg. Zorgvuldig transport van je waardevolle goederen.",
      feature: "Track & trace inbegrepen"
    },
    {
      icon: Truck,
      title: "Pallets & Grote vracht",
      description: "Professioneel transport van pallets en zware vracht tot 1500kg. Beschikbaar met laadklep.",
      feature: "Met bakwagen of bestelbus"
    },
    {
      icon: Thermometer,
      title: "Gekoeld transport",
      description: "Speciaal transport voor temperatuurgevoelige producten zoals medicijnen, voedsel of bloemen.",
      feature: "Constante temperatuur gegarandeerd"
    },
    {
      icon: Zap,
      title: "Spoedzendingen",
      description: "Voor wanneer het écht snel moet. Direct transport zonder tussenstops voor zendingen met de hoogste prioriteit.",
      feature: "24/7 beschikbaar"
    },
    {
      icon: Star,
      title: "Maatwerk transport",
      description: "Voor bijzondere zendingen zoals medische apparatuur, kunst en andere goederen die speciale aandacht vereisen.",
      feature: "Op jouw wensen afgestemd"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Wat wij voor je kunnen
            <span className="text-green-500"> vervoeren</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Van kleine documenten tot grote pallets - wij verzorgen het transport van diverse goederen, 
            altijd met zorg en precisie.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="p-6 border border-gray-200 hover:shadow-lg transition-shadow group">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
                  <IconComponent className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {service.feature}
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Klaar om je transport te regelen?
          </h3>
          <p className="text-gray-600 mb-6">
            Bereken direct je prijs of bel ons voor persoonlijk advies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              085 760 92 08
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Bereken je transport
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;