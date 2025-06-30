
import { useState } from "react";
import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid2x2, FolderOpen, Book, CircleHelp } from "lucide-react";

// Mock data for threats
const threatActors = [
  {
    id: "apt28",
    name: "APT28",
    aliases: ["Fancy Bear", "Sofacy", "Strontium"],
    origin: "Russia",
    motivations: ["Espionage", "Information theft"],
    techniques: ["T1566.002", "T1486", "T1190"],
    description: "Russian state-sponsored threat actor targeting government, military, and security organizations."
  },
  {
    id: "lazarus",
    name: "Lazarus Group",
    aliases: ["Hidden Cobra", "Guardians of Peace"],
    origin: "North Korea",
    motivations: ["Financial gain", "Regime interests"],
    techniques: ["T1566.001", "T1027", "T1059.003"],
    description: "North Korean state-sponsored group known for financial theft, WannaCry ransomware, and destructive attacks."
  },
  {
    id: "darkside",
    name: "DarkSide",
    aliases: ["Carbon Spider", "Ransomware-as-a-Service"],
    origin: "Eastern Europe",
    motivations: ["Financial gain"],
    techniques: ["T1566", "T1078", "T1486"],
    description: "Ransomware group responsible for the Colonial Pipeline attack, operating a ransomware-as-a-service model."
  },
  {
    id: "apt41",
    name: "APT41",
    aliases: ["Double Dragon", "Wicked Panda"],
    origin: "China",
    motivations: ["Espionage", "Financial gain"],
    techniques: ["T1190", "T1133", "T1559"],
    description: "Chinese threat actor conducting state-sponsored espionage and financially motivated operations."
  }
];

const malwareSamples = [
  {
    id: "zloader",
    name: "ZLoader",
    type: "Banking Trojan",
    firstSeen: "2020-03",
    techniques: ["T1204", "T1055"],
    description: "Banking trojan that steals credentials and financial information through web injection techniques.",
  },
  {
    id: "emotet",
    name: "Emotet",
    type: "Banking Trojan / Dropper",
    firstSeen: "2014-06",
    techniques: ["T1566.001", "T1027"],
    description: "Sophisticated banking trojan that serves as a downloader for other malware families.",
  },
  {
    id: "ryuk",
    name: "Ryuk",
    type: "Ransomware",
    firstSeen: "2018-08",
    techniques: ["T1486", "T1489"],
    description: "Targeted ransomware used in high-profile attacks against enterprises and critical infrastructure.",
  },
  {
    id: "solarwinds",
    name: "SUNBURST",
    type: "Supply Chain Backdoor",
    firstSeen: "2020-12",
    techniques: ["T1195.002", "T1059.003"],
    description: "Backdoor implanted in SolarWinds Orion software affecting thousands of organizations worldwide.",
  }
];

// MITRE ATT&CK tactic categories
const tactics = [
  { id: "reconnaissance", name: "Reconnaissance", color: "bg-blue-500" },
  { id: "resource-development", name: "Resource Development", color: "bg-indigo-500" },
  { id: "initial-access", name: "Initial Access", color: "bg-purple-500" },
  { id: "execution", name: "Execution", color: "bg-pink-500" },
  { id: "persistence", name: "Persistence", color: "bg-red-500" },
  { id: "privilege-escalation", name: "Privilege Escalation", color: "bg-orange-500" },
  { id: "defense-evasion", name: "Defense Evasion", color: "bg-yellow-500" },
  { id: "credential-access", name: "Credential Access", color: "bg-green-500" },
  { id: "discovery", name: "Discovery", color: "bg-teal-500" },
  { id: "lateral-movement", name: "Lateral Movement", color: "bg-cyan-500" },
  { id: "collection", name: "Collection", color: "bg-blue-400" },
  { id: "command-and-control", name: "Command & Control", color: "bg-blue-600" },
  { id: "exfiltration", name: "Exfiltration", color: "bg-violet-500" },
  { id: "impact", name: "Impact", color: "bg-rose-500" }
];

// Example techniques for the matrix
const techniques = [
  { id: "T1566.002", name: "Spearphishing Link", tactic: "initial-access" },
  { id: "T1486", name: "Data Encryption for Impact", tactic: "impact" },
  { id: "T1190", name: "Exploit Public-Facing Application", tactic: "initial-access" },
  { id: "T1133", name: "External Remote Services", tactic: "initial-access" },
  { id: "T1078", name: "Valid Accounts", tactic: "defense-evasion" },
  { id: "T1027", name: "Obfuscated Files or Information", tactic: "defense-evasion" },
  { id: "T1059.003", name: "Windows Command Shell", tactic: "execution" },
  { id: "T1204", name: "User Execution", tactic: "execution" },
  { id: "T1055", name: "Process Injection", tactic: "privilege-escalation" },
  { id: "T1489", name: "Service Stop", tactic: "impact" },
  { id: "T1195.002", name: "Compromise Software Supply Chain", tactic: "initial-access" },
  { id: "T1566.001", name: "Spearphishing Attachment", tactic: "initial-access" },
  { id: "T1559", name: "Inter-Process Communication", tactic: "execution" }
];

const ThreatLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);

  // Filter techniques based on search and selected tactic
  const filteredTechniques = techniques.filter(technique => 
    (selectedTactic ? technique.tactic === selectedTactic : true) &&
    (searchTerm ? 
      technique.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      technique.id.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true)
  );

  // Filter threat actors based on selected technique
  const filteredActors = threatActors.filter(actor => 
    !selectedTechnique || actor.techniques.includes(selectedTechnique)
  );

  // Filter malware based on selected technique
  const filteredMalware = malwareSamples.filter(malware => 
    !selectedTechnique || malware.techniques.includes(selectedTechnique)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 px-4 sm:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-kenshi-blue to-kenshi-red bg-clip-text text-transparent">
              Threat Library
            </h1>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search techniques..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="matrix" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="matrix" className="flex items-center gap-2">
                <Grid2x2 className="h-4 w-4" />
                <span>MITRE ATT&CK Matrix</span>
              </TabsTrigger>
              <TabsTrigger value="actors" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                <span>Threat Actor Profiles</span>
              </TabsTrigger>
              <TabsTrigger value="malware" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Malware Zoo</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="matrix">
              <div className="neumorph p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                  {tactics.map(tactic => (
                    <Button
                      key={tactic.id}
                      variant={selectedTactic === tactic.id ? "default" : "outline"}
                      className="justify-start h-auto py-2"
                      onClick={() => setSelectedTactic(selectedTactic === tactic.id ? null : tactic.id)}
                    >
                      <div className={`h-3 w-3 rounded-full mr-2 ${tactic.color}`}></div>
                      <span className="text-sm">{tactic.name}</span>
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredTechniques.map(technique => (
                    <Card 
                      key={technique.id}
                      className={`cursor-pointer border-l-4 hover:bg-accent transition-colors ${
                        selectedTechnique === technique.id ? 'ring-2 ring-primary' : ''
                      } ${
                        tactics.find(t => t.id === technique.tactic)?.color.replace('bg-', 'border-l-')
                      }`}
                      onClick={() => setSelectedTechnique(selectedTechnique === technique.id ? null : technique.id)}
                    >
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{technique.name}</CardTitle>
                          <Badge variant="outline">{technique.id}</Badge>
                        </div>
                        <CardDescription className="text-xs">
                          {tactics.find(t => t.id === technique.tactic)?.name}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                
                {filteredTechniques.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">No techniques found matching your criteria.</p>
                    <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(""); setSelectedTactic(null); }}>
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="actors">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredActors.map(actor => (
                  <Card key={actor.id} className="neumorph overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-900 to-slate-800 text-white">
                      <div className="flex justify-between items-center">
                        <CardTitle>{actor.name}</CardTitle>
                        <Badge variant="secondary">{actor.origin}</Badge>
                      </div>
                      <CardDescription className="text-gray-300">
                        {actor.aliases.join(" / ")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="mb-4">{actor.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Motivations</h4>
                          <div className="flex flex-wrap gap-2">
                            {actor.motivations.map(motivation => (
                              <Badge key={motivation} variant="outline" className="bg-muted">
                                {motivation}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Primary Techniques</h4>
                          <div className="flex flex-wrap gap-2">
                            {actor.techniques.map(technique => (
                              <Badge 
                                key={technique} 
                                variant="outline" 
                                className={`bg-muted ${selectedTechnique === technique ? 'ring-2 ring-primary' : ''}`}
                              >
                                {technique}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t">
                      <Button variant="ghost" size="sm" className="ml-auto">
                        View Complete Profile
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {filteredActors.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No threat actors found matching the selected technique.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setSelectedTechnique(null)}>
                      Clear selection
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="malware">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMalware.map(malware => (
                  <Card key={malware.id} className="neumorph">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{malware.name}</CardTitle>
                        <Badge variant="outline">{malware.type}</Badge>
                      </div>
                      <CardDescription>First seen: {malware.firstSeen}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{malware.description}</p>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Associated Techniques</h4>
                        <div className="flex flex-wrap gap-2">
                          {malware.techniques.map(technique => (
                            <Badge 
                              key={technique} 
                              variant="outline" 
                              className={`bg-muted ${selectedTechnique === technique ? 'ring-2 ring-primary' : ''}`}
                            >
                              {technique}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="outline" size="sm">
                        YARA Rules
                      </Button>
                      <Button variant="default" size="sm">
                        View Analysis
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {filteredMalware.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No malware samples found matching the selected technique.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setSelectedTechnique(null)}>
                      Clear selection
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Documentation tooltip */}
          <div className="fixed bottom-4 right-4">
            <div className="bg-background/80 backdrop-blur-sm neumorph p-3 rounded-full flex items-center gap-2 shadow-lg">
              <CircleHelp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Hover over elements for more information</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThreatLibrary;
