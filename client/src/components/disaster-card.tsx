import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";
import type { Disaster } from "@shared/schema";
import { format } from "date-fns";

interface DisasterCardProps {
  disaster: Disaster;
}

export function DisasterCard({ disaster }: DisasterCardProps) {
  const severityColors = {
    1: "bg-blue-500",
    2: "bg-yellow-500",
    3: "bg-orange-500",
    4: "bg-red-500",
    5: "bg-purple-500",
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{disaster.title}</CardTitle>
          <Badge variant="outline" className={severityColors[disaster.severity as keyof typeof severityColors]}>
            Level {disaster.severity}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {format(new Date(disaster.timestamp), 'PPp')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{disaster.description}</p>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="text-sm">Affected areas: {disaster.affectedAreas.join(', ')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
