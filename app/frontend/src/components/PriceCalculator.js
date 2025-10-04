import React, { useState } from \"react\";
import { Button } from \"./ui/button\";
import { Input } from \"./ui/input\";
import { Card } from \"./ui/card\";
import { Truck, Package, Warehouse } from \"lucide-react\";
import { useToast } from \"../hooks/use-toast\";
import axios from \"axios\";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PriceCalculator = () => {
  const [pickup, setPickup] = useState(\"\");
  const [delivery, setDelivery] = useState(\"\");
  const [vehicle, setVehicle] = useState(\"\");
  const [calculating, setCalculating] = useState(false);
  const { toast } = useToast();

  const vehicleTypes = [
    {
      id: \"bestelauto\",
      name: \"Bestelauto\",
      icon: Truck,
      description: \"Tot 500kg\"
    },
    {
      id: \"bestelbus\",
      name: \"Bestelbus\", 
      icon: Package,
      description: \"Tot 1000kg\"
    },
    {
      id: \"bakwagen\",
      name: \"Bakwagen\",
      icon: Warehouse,
      description: \"Tot 1500kg\"
    }
  ];

  const handleCalculate = async () => {
    if (!pickup || !delivery || !vehicle) {
      toast({
        title: \"Vul alle velden in\",
        description: \"Vul beide adressen in en selecteer een voertuig\",
        variant: \"destructive\"
      });
      return;
    }

    setCalculating(true);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/orders/calculate-price`, null, {
        params: {
          pickup_address: pickup,
          delivery_address: delivery,
          vehicle_type: vehicle
        }
      });
      
      const result = response.data;
      
      toast({
        title: \"Transportprijs berekend!\",
        description: `Geschatte prijs: €${result.total_price} - Geschatte tijd: ${result.estimated_time}`,
      });
      
    } catch (error) {
      console.error(\"Price calculation error:\", error);
      toast({
        title: \"Fout bij berekening\",
        description: \"Er ging iets mis bij het berekenen van de prijs. Probeer opnieuw.\",
        variant: \"destructive\"
      });
    } finally {
      setCalculating(false);
    }
  };