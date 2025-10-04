import React from "react";
import { Phone, MessageCircle, Mail, Globe } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const Contact = () => {
  const europeanCountries = [
    { code: "de", name: "Duitsland" },
    { code: "be", name: "België" },
    { code: "fr", name: "Frankrijk" },
    { code: "lu", name: "Luxemburg" },
    { code: "gb", name: "Groot-Brittannië" },
    { code: "es", name: "Spanje" },
    { code: "it", name: "Italië" },
    { code: "pl", name: "Polen" },
    { code: "at", name: "Oostenrijk" },
    { code: "cz", name: "Tsjechië" },
    { code: "sk", name: "Slowakije" },
    { code: "hu", name: "Hongarije" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Methods */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Direct contact opnemen
            </h2>
            <p className="text-lg text-gray-600">
              Kom je er niet uit, of heb je vragen? Onze planners zijn 7 dagen per week bereikbaar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Phone Contact */}
            <Card className="p-6 border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer group">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <Phone className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-500">Tot 23:00</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Bel direct</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">085 760 92 08</p>
                  <p className="text-sm text-gray-600">
                    Direct persoonlijk contact met een van onze planners
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Tik om te bellen</p>
                </div>
              </div>
            </Card>

            {/* WhatsApp Contact */}
            <Card className="p-6 border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer group">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-500">Snel</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">WhatsApp</h3>
                  <p className="text-lg font-semibold text-gray-700 mb-2">123 Geleverd</p>
                  <p className="text-sm text-gray-600">
                    Chat direct met onze planning, eenvoudig en snel
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Tik om te chatten</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Email Contact */}
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="p-6 text-center">
              <Mail className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">E-mail ons</h3>
              <p className="text-green-600 font-medium mb-2">info@123geleverd.nl</p>
              <p className="text-sm text-gray-600 mb-4">
                Voor algemene vragen en informatie, binnen 24 uur reactie
              </p>
              <Button variant="outline" size="sm">
                Stuur een bericht
              </Button>
            </Card>
          </div>
        </div>

        {/* International Services */}
        <div className="bg-white rounded-2xl p-8">
          <div className="text-center mb-8">
            <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Internationale transport
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Voor grensoverschrijdende leveringen in heel Europa staan we voor je klaar. 
              Onze internationale koeriersdienst biedt flexibele levertijden en concurrerende 
              tarieven voor transporten naar alle Europese landen.
            </p>
          </div>

          <div className="mb-8">
            <h4 className="text-center text-lg font-semibold text-gray-700 mb-6">
              Ook beschikbaar in:
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-4">
              {europeanCountries.map((country) => (
                <div key={country.code} className="text-center group cursor-pointer">
                  <div className="w-12 h-8 mx-auto mb-2 rounded overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${country.code}.svg`}
                      alt={country.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-green-600 transition-colors">
                    {country.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              Neem contact op voor exacte prijsopgave.
            </p>
            <p className="font-semibold text-gray-900 mb-4">
              Internationaal transport nodig? Neem direct contact op!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">085 760 92 08</Button>
              <Button variant="outline">WhatsApp</Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Offerte aanvragen
              </Button>
            </div>
          </div>
        </div>

        {/* Emergency Transport */}
        <div className="mt-8 bg-green-500 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Direct transport nodig?</h3>
          <p className="mb-6">
            Voor spoedleveringen zijn we telefonisch bereikbaar tot 23:00 uur. 
            We sturen direct een koerier naar je toe!
          </p>
          <Button 
            variant="outline" 
            className="bg-white text-green-600 hover:bg-gray-50 border-white mb-4"
          >
            085 760 92 08
          </Button>
          <p className="text-green-100 text-sm">
            Binnen 45 minuten een koerier
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;