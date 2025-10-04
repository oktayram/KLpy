"// Mock data for 123geleverd.nl clone

export const mockPriceCalculation = (pickup, delivery, vehicle) => {
  // Mock price calculation based on vehicle type and distance (simulated)
  const vehiclePrices = {
    bestelauto: { base: 25, perKm: 1.2 },
    bestelbus: { base: 35, perKm: 1.5 },
    bakwagen: { base: 45, perKm: 1.8 }
  };

  // Simulate distance calculation based on postcodes
  const mockDistance = Math.floor(Math.random() * 50) + 5; // 5-55 km
  const vehicleConfig = vehiclePrices[vehicle] || vehiclePrices.bestelauto;
  
  const price = Math.round(vehicleConfig.base + (mockDistance * vehicleConfig.perKm));
  const time = Math.floor(mockDistance / 30 * 60) + 15; // Travel time + 15min pickup

  return {
    price: price,
    time: `${time} minuten`,
    distance: `${mockDistance} km`,
    vehicle: vehicle
  };
};

export const mockAddresses = [
  \"1012 AB Amsterdam\",
  \"3011 AD Rotterdam\", 
  \"2511 CV Den Haag\",
  \"3511 LN Utrecht\",
  \"5611 AB Eindhoven\",
  \"6511 VS Nijmegen\",
  \"9712 CP Groningen\",
  \"7511 JE Enschede\"
];

export const mockReviews = [
  {
    id: 1,
    rating: 5,
    name: \"Johan v.\",
    text: \"Supersnel geleverd! Binnen 30 minuten stond de koerier voor de deur.\",
    date: \"2 dagen geleden\"
  },
  {
    id: 2,
    rating: 5,
    name: \"Maria K.\",
    text: \"Heel betrouwbaar en vriendelijke service. Track & trace werkte perfect.\",
    date: \"1 week geleden\"
  },
  {
    id: 3,
    rating: 4,
    name: \"Peter D.\",
    text: \"Goede prijs-kwaliteitverhouding. Zending veilig aangekomen.\",
    date: \"2 weken geleden\"
  }
];

export const mockCompanyStats = {
  deliveries: \"50.000+\",
  cities: \"400+\",
  rating: 9.2,
  responseTime: \"45 minuten\"
};

export const mockTrackingData = {
  \"TR123456\": {
    status: \"In transit\",
    location: \"Amsterdam Centrum\",
    estimatedDelivery: \"14:30\",
    updates: [
      { time: \"12:15\", status: \"Opgehaald\", location: \"Utrecht Centrum\" },
      { time: \"13:00\", status: \"Onderweg\", location: \"A2 richting Amsterdam\" },
      { time: \"13:45\", status: \"In Amsterdam\", location: \"Amsterdam Ring\" }
    ]
  },
  \"TR789012\": {
    status: \"Delivered\",
    location: \"Rotterdam Centrum\", 
    deliveredAt: \"11:45\",
    recipient: \"J. Janssen\",
    updates: [
      { time: \"09:30\", status: \"Opgehaald\", location: \"Den Haag\" },
      { time: \"10:15\", status: \"Onderweg\", location: \"A13 richting Rotterdam\" },
      { time: \"11:45\", status: \"Afgeleverd\", location: \"Rotterdam Centrum\" }
    ]
  }
};

export const mockContactInfo = {
  phone: \"085 760 92 08\",
  whatsapp: \"+31857609208\",
  email: \"info@123geleverd.nl\",
  hours: {
    weekdays: \"07:00 - 23:00\",
    weekend: \"08:00 - 20:00\"
  }
};

export const mockServiceAreas = {
  netherlands: [
    \"Amsterdam\", \"Rotterdam\", \"Den Haag\", \"Utrecht\", \"Eindhoven\",
    \"Tilburg\", \"Groningen\", \"Almere\", \"Breda\", \"Nijmegen\"
  ],
  belgium: [
    \"Antwerpen\", \"Gent\", \"Charleroi\", \"Luik\", \"Brugge\", \"Namur\"
  ],
  international: [
    { country: \"Duitsland\", cities: [\"Berlin\", \"Hamburg\", \"München\"] },
    { country: \"Frankrijk\", cities: [\"Parijs\", \"Lyon\", \"Marseille\"] },
    { country: \"België\", cities: [\"Brussel\", \"Antwerpen\", \"Gent\"] }
  ]
};

// Mock API functions
export const mockApiCall = (endpoint, data = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (endpoint) {
        case \"/calculate-price\":
          resolve(mockPriceCalculation(data.pickup, data.delivery, data.vehicle));
          break;
        case \"/track\":
          resolve(mockTrackingData[data.trackingNumber] || null);
          break;
        case \"/contact\":
          resolve({ success: true, message: \"Bericht verzonden!\" });
          break;
        default:
          resolve({ success: true });
      }
    }, Math.random() * 1000 + 500); // 500-1500ms delay
  });
};"