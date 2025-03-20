import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Wind, Cloud, Waves, Mountain, Bell, MapPin, Settings } from "lucide-react";
import { DisasterMap } from "@/components/disaster-map";

//Type definitions -  These will need to be defined based on your actual API response
type Alert = {
  // Add your alert type properties here
};

type Disaster = {
  // Add your disaster type properties here
  location: {lat: number, lng: number}
};


const disasterTypes = [
  { 
    id: "cyclone",
    name: "Cyclones",
    icon: Wind,
    description: "Track cyclone paths and get real-time updates",
    color: "text-blue-500",
    cardClass: "disaster-card-cyclone"
  },
  {
    id: "flood",
    name: "Floods",
    icon: Waves,
    description: "Monitor water levels and flood warnings",
    color: "text-cyan-500",
    cardClass: "disaster-card-flood"
  },
  {
    id: "earthquake",
    name: "Earthquakes",
    icon: Mountain,
    description: "Get instant earthquake alerts and aftershock predictions",
    color: "text-orange-500",
    cardClass: "disaster-card-earthquake"
  },
  {
    id: "storm",
    name: "Storms",
    icon: Cloud,
    description: "Stay ahead of severe weather conditions",
    color: "text-purple-500",
    cardClass: "disaster-card-storm"
  }
];

export default function Home() {
  const { data: activeAlerts } = useQuery<Alert[]>({
    queryKey: ['/api/alerts/active']
  });

  const { data: disasters } = useQuery<Disaster[]>({
    queryKey: ['/api/disasters']
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="hero-section">
        <div className="text-center px-4">
          <h1 className="prism-title">PRISM</h1>
          <p className="prism-subtitle text-gray-300 max-w-2xl mx-auto">
            Preparedness and Response Information System Management
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/settings">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Alert Settings
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notification Center
              </Button>
            </Link>
          </div>
          {activeAlerts?.length > 0 && (
            <div className="mt-8">
              <div className="alert-badge inline-flex">
                <AlertTriangle className="h-5 w-5" />
                <span>{activeAlerts.length} Active Alerts</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Disaster Monitoring Systems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disasterTypes.map((type) => (
              <Card key={type.id} className={`disaster-card ${type.cardClass}`}>
                <CardHeader>
                  <type.icon className={`h-8 w-8 mb-2 ${type.color}`} />
                  <CardTitle>{type.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{type.description}</p>
                  <Link href={`/dashboard/${type.id}`}>
                    <Button className="w-full">Monitor Now</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Current Disaster Zones
          </h2>
          {disasters && (
            <DisasterMap 
              disasters={disasters} 
              className="w-full shadow-xl"
              onMarkerClick={(disaster) => {
                console.log('Selected disaster:', disaster);
              }}
            />
          )}
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">
            Real-Time Alert System
          </h3>
          <p className="text-muted-foreground">
            Get instant notifications through WhatsApp and SMS for disasters in your area.
            Our system processes data from multiple sources to provide accurate and timely alerts.
          </p>
        </div>
      </div>
    </div>
  );
}