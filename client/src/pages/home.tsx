import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Wind, Cloud, Waves, Mountain } from "lucide-react";

const disasterTypes = [
  { 
    id: "cyclone",
    name: "Cyclones",
    icon: Wind,
    description: "Track cyclone paths and get real-time updates",
    color: "text-blue-500"
  },
  {
    id: "flood",
    name: "Floods",
    icon: Waves,
    description: "Monitor water levels and flood warnings",
    color: "text-cyan-500"
  },
  {
    id: "earthquake",
    name: "Earthquakes",
    icon: Mountain,
    description: "Get instant earthquake alerts and aftershock predictions",
    color: "text-orange-500"
  },
  {
    id: "storm",
    name: "Storms",
    icon: Cloud,
    description: "Stay ahead of severe weather conditions",
    color: "text-purple-500"
  }
];

export default function Home() {
  const { data: activeAlerts } = useQuery({
    queryKey: ['/api/alerts/active']
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="hero-section min-h-[60vh] flex items-center justify-center relative">
        <div className="hero-overlay" />
        <div className="relative z-10 text-center px-4">
          <h1 className="prism-title mb-4">PRISM</h1>
          <p className="prism-subtitle text-white max-w-2xl mx-auto">
            Preparedness and Response Information System Management
          </p>
          {activeAlerts?.length > 0 && (
            <div className="mt-8">
              <Card className="inline-block bg-red-50/90 dark:bg-red-900/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold">
                      {activeAlerts.length} Active Alerts
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Disaster Monitoring Systems
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {disasterTypes.map((type) => (
            <Card key={type.id} className="hover:shadow-lg transition-shadow">
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

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Real-Time Alert System
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get instant notifications through WhatsApp and SMS for disasters in your area.
            Our system processes data from multiple sources to provide accurate and timely alerts.
          </p>
        </div>
      </div>
    </div>
  );
}