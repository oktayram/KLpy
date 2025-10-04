import React from "react";
import { Zap, MapPin, CreditCard, Globe, Clock, Shield } from "lucide-react";
import { Button } from "./ui/button";

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Razendsnel boeken",
      description: "Binnen 3 minuten geregeld via onze gebruiksvriendelijke website, zonder ingewikkelde stappen."
    },
    {
      icon: MapPin,
      title: "Real-time tracking",
      description: "Volg je zending realtime en ontvang automatisch bewijs van aflevering na bezorging."
    },
    {
      icon: CreditCard,
      title: "Flexibele betaling",
      description: "Direct via iDEAL of Bancontact, of kies voor zakelijke facturatie zonder aanvraagprocedure."
    },
    {
      icon: Globe,
      title: "Volledige dekking",
      description: "Directe beschikbaarheid in heel Nederland en België, 24/7 en 365 dagen per jaar."
    },
    {
      icon: Clock,
      title: "Maximale tijdswinst",
      description: "Binnen 45 minuten een koerier voor de deur, zodat jij je kunt richten op wat echt belangrijk is voor jou."
    },
    {
      icon: Shield,
      title: "Volledig verzekerd",
      description: "Al je zendingen zijn standaard beschermd voor extra zekerheid en gemoedsrust."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Dit maakt ons uniek
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Al onze diensten zijn ontworpen om jouw logistieke uitdagingen eenvoudiger en efficiënter te maken.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                  <IconComponent className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg">
            Direct verzenden
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;