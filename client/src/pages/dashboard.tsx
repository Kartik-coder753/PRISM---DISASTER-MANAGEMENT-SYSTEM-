import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useWebSocketStore } from "@/lib/websocket";
import { DisasterCard } from "@/components/disaster-card";
import { AlertCard } from "@/components/alert-card";
import { LocationFilter } from "@/components/location-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { DisasterMap } from "@/components/disaster-map";

export default function Dashboard() {
  const { type } = useParams();
  const connect = useWebSocketStore((state) => state.connect);

  useEffect(() => {
    connect();
  }, [connect]);

  const { data: disasters, isLoading: loadingDisasters } = useQuery({
    queryKey: [`/api/disasters/type/${type}`]
  });

  const { data: alerts, isLoading: loadingAlerts } = useQuery({
    queryKey: ['/api/alerts/active']
  });

  const { data: recentAlerts } = useQuery({
    queryKey: ['/api/alerts/72h']
  });

  const handleLocationChange = (location: string) => {
    // Filter disasters based on location
    console.log("Location changed:", location);
  };

  if (loadingDisasters || loadingAlerts) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{type} Monitoring</h1>

      <LocationFilter onLocationChange={handleLocationChange} />

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Disaster Zones</h2>
        {disasters && (
          <DisasterMap 
            disasters={disasters}
            activeType={type}
            className="w-full h-[400px] shadow-xl rounded-lg"
            onMarkerClick={(disaster) => {
              console.log('Selected disaster:', disaster);
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
          {disasters?.map((disaster) => (
            <DisasterCard key={disaster.id} disaster={disaster} />
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
            {alerts?.map((alert) => {
              const disaster = disasters?.find(d => d.id === alert.disasterId);
              if (!disaster) return null;
              return (
                <AlertCard 
                  key={alert.id} 
                  alert={alert}
                  disaster={disaster}
                />
              );
            })}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">72-Hour Alert History</h2>
            {recentAlerts?.map((alert) => {
              const disaster = disasters?.find(d => d.id === alert.disasterId);
              if (!disaster) return null;
              return (
                <AlertCard 
                  key={alert.id} 
                  alert={alert}
                  disaster={disaster}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}