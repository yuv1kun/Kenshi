
import React from 'react';
import { HolographicDisplay } from "@/components/cyberpunk-visuals/HolographicDisplay";
import { CyberThreatHeatMap } from "@/components/cyberpunk-visuals/CyberThreatHeatMap";
import { AttackVectorRadar } from "@/components/cyberpunk-visuals/AttackVectorRadar";

interface CyberpunkVisualizationsSectionProps {
  activeThreats: number;
  anomalyScore: number;
}

export function CyberpunkVisualizationsSection({
  activeThreats,
  anomalyScore
}: CyberpunkVisualizationsSectionProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <HolographicDisplay title="Threat Intelligence Hub" glowColor="red" className="h-[300px]">
        <CyberThreatHeatMap 
          threats={activeThreats} 
          anomalyScore={anomalyScore}
          className="h-full"
        />
      </HolographicDisplay>
      
      <HolographicDisplay title="Attack Vector Analysis" glowColor="blue" className="h-[300px]">
        <AttackVectorRadar 
          threats={activeThreats}
          anomalyScore={anomalyScore}
          className="h-full"
        />
      </HolographicDisplay>
    </section>
  );
}
