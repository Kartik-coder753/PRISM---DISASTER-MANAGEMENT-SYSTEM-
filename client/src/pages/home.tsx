import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Wind, Cloud, Waves, Mountain, Bell, MapPin, Settings } from "lucide-react";
import { DisasterMap } from "@/components/disaster-map";

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
  const { data: activeAlerts } = useQuery({
    queryKey: ['/api/alerts/active']
  });

  const { data: disasters } = useQuery({
    queryKey: ['/api/disasters']
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="hero-section">
        <div className="text-center px-4">
          <h1 className="prism-title">PRISM</h1>
          <p className="prism-subtitle text-gray-300 max-w-2xl mx-auto">
            Proactive Response & Intelligent System for Mitigation
          </p>
          <div className="mt-4 text-gray-400 text-sm max-w-xl mx-auto">
            A comprehensive disaster management platform for predicting, monitoring, 
            and responding to natural disasters across India
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/settings">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Alert Settings
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="destructive" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notification Center
                {activeAlerts?.length > 0 && (
                  <span className="ml-2 bg-white text-red-600 rounded-full px-2 py-0.5 text-xs font-bold">
                    {activeAlerts.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
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

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Disaster Monitoring Systems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disasterTypes.map((type) => (
              <Link key={type.id} href={`/dashboard/${type.id}`}>
                <Card className={`disaster-card ${type.cardClass} h-full cursor-pointer`}>
                  <CardHeader>
                    <type.icon className={`h-8 w-8 mb-2 ${type.color}`} />
                    <CardTitle>{type.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">
            Intelligent Alert System
          </h3>
          <p className="text-muted-foreground">
            Our AI-powered system processes real-time data from multiple sources to provide 
            accurate and timely alerts. Get instant notifications through WhatsApp and SMS 
            with precise impact assessments and safety instructions.
          </p>
        </div>
      </div>
    </div>
  );
}