import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import type { Alert, Disaster } from "@shared/schema";
import { format } from "date-fns";

interface AlertCardProps {
  alert: Alert;
  disaster: Disaster;
}

export function AlertCard({ alert, disaster }: AlertCardProps) {
  return (
    <Card className="bg-red-50 dark:bg-red-900/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            {disaster.title}
          </CardTitle>
          <Badge variant={alert.status === 'active' ? 'destructive' : 'outline'}>
            {alert.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{alert.message}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(alert.timestamp), 'PPp')}
        </p>
      </CardContent>
    </Card>
  );
}
