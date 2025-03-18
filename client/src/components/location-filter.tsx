import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationFilterProps {
  onLocationChange: (location: string) => void;
}

export function LocationFilter({ onLocationChange }: LocationFilterProps) {
  const [locations] = useState([
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
    "Hyderabad", "Pune", "Ahmedabad", "Surat", "Jaipur"
  ]);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <Select onValueChange={onLocationChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input 
            type="text" 
            placeholder="Search other locations..." 
            className="flex-1"
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
