import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Phone, MapPin } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");

  const [settings, setSettings] = useState({
    whatsapp: true,
    sms: false,
    email: true,
    severityLevel: "all", // all, high, extreme
    notificationTypes: {
      cyclone: true,
      earthquake: true,
      flood: true,
      storm: true
    },
    alertPreferences: {
      immediate: true,
      hourly: true,
      daily: true,
      weekly: false
    },
    radius: "50" // km
  });

  const handleSave = () => {
    // Here we would typically save to backend
    toast({
      title: "Settings Updated",
      description: "Your alert preferences have been saved successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Alert Settings</h1>

      <div className="grid gap-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="whatsapp">WhatsApp Alerts</Label>
              <Switch
                id="whatsapp"
                checked={settings.whatsapp}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, whatsapp: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms">SMS Alerts</Label>
              <Switch
                id="sms"
                checked={settings.sms}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, sms: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email Alerts</Label>
              <Switch
                id="email"
                checked={settings.email}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, email: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 xxxxx xxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Alert Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Alert Radius (km)</Label>
              <Select 
                value={settings.radius}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, radius: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select alert radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="25">25 km</SelectItem>
                  <SelectItem value="50">50 km</SelectItem>
                  <SelectItem value="100">100 km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Alert Severity Level</Label>
              <Select 
                value={settings.severityLevel}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, severityLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="high">High Severity Only</SelectItem>
                  <SelectItem value="extreme">Extreme Events Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Alert Frequency</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="immediate">Immediate Alerts</Label>
                  <Switch
                    id="immediate"
                    checked={settings.alertPreferences.immediate}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        alertPreferences: {
                          ...prev.alertPreferences,
                          immediate: checked
                        }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hourly">Hourly Updates</Label>
                  <Switch
                    id="hourly"
                    checked={settings.alertPreferences.hourly}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        alertPreferences: {
                          ...prev.alertPreferences,
                          hourly: checked
                        }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="daily">Daily Summary</Label>
                  <Switch
                    id="daily"
                    checked={settings.alertPreferences.daily}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        alertPreferences: {
                          ...prev.alertPreferences,
                          daily: checked
                        }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly">Weekly Report</Label>
                  <Switch
                    id="weekly"
                    checked={settings.alertPreferences.weekly}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        alertPreferences: {
                          ...prev.alertPreferences,
                          weekly: checked
                        }
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Monitored Disaster Types</Label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(settings.notificationTypes).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <Label htmlFor={type} className="capitalize">{type}</Label>
                    <Switch
                      id={type}
                      checked={enabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          notificationTypes: {
                            ...prev.notificationTypes,
                            [type]: checked
                          }
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </div>
    </div>
  );
}