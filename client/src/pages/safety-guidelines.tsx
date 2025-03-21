import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, Phone, Ambulance, AlertTriangle, Wind, Cloud, Waves, Mountain } from "lucide-react";
import { Link } from "wouter";

const emergencyContacts = [
  { name: "National Emergency Response Centre", number: "011-23438252" },
  { name: "National Disaster Response Force", number: "011-24363260" },
  { name: "National Crisis Management Committee", number: "1070" },
  { name: "State Disaster Management Authority", number: "1077" },
];

const disasterGuidelines = {
  cyclone: {
    title: "Cyclone Safety Guidelines",
    before: [
      "Keep your emergency kit ready",
      "Secure important documents in a waterproof container",
      "Keep monitoring local weather updates",
      "Have a battery-operated radio handy",
    ],
    during: [
      "Stay indoors and away from windows",
      "Keep monitoring official announcements",
      "Switch off electrical mains if needed",
      "Don't venture out until official clearance",
    ],
    after: [
      "Wait for official confirmation before returning home",
      "Be careful of fallen power lines",
      "Drink only boiled or chlorinated water",
      "Report any damage to authorities",
    ],
  },
  earthquake: {
    title: "Earthquake Safety Guidelines",
    before: [
      "Identify safe spots in your building",
      "Keep heavy objects at lower levels",
      "Know the location of utility switches",
      "Practice earthquake drills",
    ],
    during: [
      "Drop, Cover, and Hold On",
      "Stay away from windows and furniture",
      "If outdoors, move to open areas",
      "If in a vehicle, stop safely away from buildings",
    ],
    after: [
      "Check for injuries and provide first aid",
      "Be prepared for aftershocks",
      "Check for gas leaks and damage",
      "Listen to official instructions",
    ],
  },
  flood: {
    title: "Flood Safety Guidelines",
    before: [
      "Move valuable items to higher ground",
      "Keep emergency supplies ready",
      "Clear drains and gutters",
      "Store drinking water",
    ],
    during: [
      "Move to higher ground immediately",
      "Avoid walking through flowing water",
      "Don't drive through flooded areas",
      "Follow evacuation orders promptly",
    ],
    after: [
      "Wait for official 'all-clear' signal",
      "Avoid floodwaters - may be contaminated",
      "Document damage for insurance",
      "Clean and disinfect everything that got wet",
    ],
  },
};

export default function SafetyGuidelines() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Safety Guidelines & Emergency Contacts</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-500" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Save these numbers in your phone for quick access during emergencies.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact) => (
                <Card key={contact.name}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">{contact.name}</h3>
                    <a 
                      href={`tel:${contact.number}`}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      {contact.number}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Disaster Safety Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cyclone">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cyclone" className="flex items-center gap-2">
                  <Wind className="h-4 w-4" /> Cyclone
                </TabsTrigger>
                <TabsTrigger value="earthquake" className="flex items-center gap-2">
                  <Mountain className="h-4 w-4" /> Earthquake
                </TabsTrigger>
                <TabsTrigger value="flood" className="flex items-center gap-2">
                  <Waves className="h-4 w-4" /> Flood
                </TabsTrigger>
              </TabsList>

              {Object.entries(disasterGuidelines).map(([key, guidelines]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">{guidelines.title}</h2>
                  
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Before Disaster</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-4 space-y-2">
                          {guidelines.before.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>During Disaster</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-4 space-y-2">
                          {guidelines.during.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>After Disaster</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-4 space-y-2">
                          {guidelines.after.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ambulance className="h-5 w-5 text-blue-500" />
              Resources & Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Access official resources and training materials from government disaster management agencies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="https://ndma.gov.in/Resources/Training-Materials">
                  Training Materials
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="https://ndma.gov.in/Resources/Public-Awareness">
                  Public Awareness
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
