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
    description: "Track cyclone paths and get real-time updates"
  },
  {
    id: "flood",
    name: "Floods",
    icon: Waves,
    description: "Monitor water levels and flood warnings"
  },
  {
    id: "earthquake",
    name: "Earthquakes",
    icon: Mountain,
    description: "Get instant earthquake alerts and aftershock predictions"
  },
  {
    id: "storm",
    name: "Storms",
    icon: Cloud,
    description: "Stay ahead of severe weather conditions"
  }
];

export default function Home() {
  const { data: activeAlerts } = useQuery({
    queryKey: ['/api/alerts/active']
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">PRISM</h1>
        <p className="text-xl text-muted-foreground">
          Preparedness and Response Information System Management
        </p>
      </header>

      {activeAlerts?.length > 0 && (
        <Card className="mb-8 bg-red-50 dark:bg-red-900/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">
                {activeAlerts.length} Active Alerts
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {disasterTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <type.icon className="h-8 w-8 mb-2" />
              <CardTitle>{type.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{type.description}</p>
              <Link href={`/dashboard/${type.id}`}>
                <Button className="w-full">View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
