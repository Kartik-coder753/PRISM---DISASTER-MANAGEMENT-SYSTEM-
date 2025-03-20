import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertTriangle, Info } from "lucide-react";
import type { Alert } from "@shared/schema";

export default function Notifications() {
  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ['/api/alerts']
  });

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 1: return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Bell className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Notification Center</h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[600px] mt-6">
          {['all', 'active', 'resolved', 'important'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {alerts?.filter(alert => {
                if (tab === 'active') return alert.status === 'active';
                if (tab === 'resolved') return alert.status === 'resolved';
                if (tab === 'important') return alert.priority === 3;
                return true;
              }).map((alert) => (
                <Card key={alert.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(alert.status)}
                        <CardTitle className="text-lg">{alert.message}</CardTitle>
                      </div>
                      <Badge className={getPriorityColor(alert.priority)}>
                        Priority {alert.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Time: {new Date(alert.timestamp).toLocaleString()}</p>
                      {alert.affectedPopulation && (
                        <p>Affected Population: {alert.affectedPopulation.toLocaleString()}</p>
                      )}
                      {alert.evacuationRequired && (
                        <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded-md">
                          <p className="font-semibold text-red-600 dark:text-red-400">
                            Evacuation Required
                          </p>
                          <p className="mt-1">{alert.safetyInstructions}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </div>
  );
}
