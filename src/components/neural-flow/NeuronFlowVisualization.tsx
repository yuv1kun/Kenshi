import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Zap, Download, Settings } from "lucide-react";
import { NeuralActivityIndicator } from "@/components/neural-activity-indicator";
import { NeuralFlowParticles } from "./NeuralFlowParticles";
import { generateInitialNeurons } from "./NeuronDataGenerator";
import { TrafficSimulator } from "./TrafficSimulator";

interface NeuronFlowVisualizationProps {
  anomalyScore: number;
  isAnalysisActive: boolean;
  activeThreats: number;
}

export function NeuronFlowVisualization({ 
  anomalyScore, 
  isAnalysisActive, 
  activeThreats 
}: NeuronFlowVisualizationProps) {
  const [neurons, setNeurons] = useState(generateInitialNeurons(30));
  const [layerVisibility, setLayerVisibility] = useState({
    input: true,
    hidden: true,
    output: true
  });
  const [showFlowParticles, setShowFlowParticles] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [hoverNeuron, setHoverNeuron] = useState<any>(null);
  const [trafficSimulator] = useState(() => new TrafficSimulator(neurons, anomalyScore, isAnalysisActive));

  // Update neurons based on analysis activity
  useEffect(() => {
    if (!isAnalysisActive) return;

    const interval = setInterval(() => {
      trafficSimulator.updateState(neurons, anomalyScore, isAnalysisActive);
      const patterns = trafficSimulator.generateTrafficPatterns();
      const updatedNeurons = trafficSimulator.updateNeuronStates(patterns);
      setNeurons(updatedNeurons);
    }, 800);

    return () => clearInterval(interval);
  }, [isAnalysisActive, anomalyScore, trafficSimulator]);

  const handleExportData = () => {
    const data = neurons.map(neuron => ({
      id: neuron.id,
      layer: neuron.layer,
      spikeCount: neuron.spikeCount,
      lastFired: neuron.lastFired,
      trafficState: neuron.trafficState,
      intensity: neuron.intensity,
      connections: neuron.connections.length
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neural-flow-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Organize neurons by layers for proper positioning
  const inputNeurons = neurons.filter(n => n.layer === 'input').slice(0, 6);
  const hiddenNeurons = neurons.filter(n => n.layer === 'hidden').slice(0, 8);
  const outputNeurons = neurons.filter(n => n.layer === 'output').slice(0, 4);

  const renderNeuron = (neuron: any, x: number, y: number) => {
    let neuronColor = '#3B82F6';
    let intensity = neuron.intensity || 0.3;
    
    switch (neuron.trafficState) {
      case 'anomaly':
        neuronColor = '#EF4444';
        break;
      case 'suspicious':
        neuronColor = '#F59E0B';
        break;
      default:
        switch (neuron.layer) {
          case 'input': neuronColor = '#10B981'; break;
          case 'hidden': neuronColor = '#3B82F6'; break;
          case 'output': neuronColor = '#8B5CF6'; break;
        }
    }

    const isActive = neuron.lastFired && (Date.now() / 1000) - neuron.lastFired < 2;
    const radius = isActive ? 10 : 8;

    return (
      <g key={neuron.id}>
        {/* Glow effect for active neurons */}
        {isActive && (
          <circle
            cx={x}
            cy={y}
            r={radius * 1.8}
            fill={neuronColor}
            opacity={intensity * 0.2}
          />
        )}
        {/* Main neuron */}
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={neuronColor}
          opacity={isActive ? 0.9 : 0.7}
          stroke={isActive ? '#fff' : neuronColor}
          strokeWidth={isActive ? 2 : 1}
          onMouseEnter={() => setHoverNeuron(neuron)}
          onMouseLeave={() => setHoverNeuron(null)}
          style={{ cursor: 'pointer' }}
        />
        {/* Activity pulse animation */}
        {isActive && (
          <circle
            cx={x}
            cy={y}
            r={radius}
            fill="none"
            stroke={neuronColor}
            strokeWidth="2"
            opacity="0.6"
          >
            <animate
              attributeName="r"
              values={`${radius};${radius * 1.5};${radius}`}
              dur="1.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </g>
    );
  };

  const renderConnections = () => {
    if (!showConnections) return null;

    const connections = [];
    const layerPositions = { input: 150, hidden: 350, output: 550 };

    // Input to Hidden connections - organized and clean
    inputNeurons.forEach((fromNeuron, fromIndex) => {
      if (!layerVisibility.input) return;
      
      const fromY = 120 + (fromIndex * 40);
      const fromX = layerPositions.input;

      // Connect each input neuron to 2-3 hidden neurons in a structured way
      const targetHiddenIndices = [
        Math.floor(fromIndex * 1.3) % hiddenNeurons.length,
        Math.floor(fromIndex * 1.3 + 1) % hiddenNeurons.length
      ];

      targetHiddenIndices.forEach(toIndex => {
        if (toIndex >= hiddenNeurons.length) return;
        const toNeuron = hiddenNeurons[toIndex];
        if (!layerVisibility.hidden) return;

        const toY = 100 + (toIndex * 30);
        const toX = layerPositions.hidden;

        const isActive = fromNeuron.lastFired && (Date.now() / 1000) - fromNeuron.lastFired < 2;
        
        let strokeColor = '#64748B';
        let strokeWidth = 1;
        let opacity = 0.3;

        if (isActive) {
          switch (fromNeuron.trafficState) {
            case 'anomaly':
              strokeColor = '#EF4444';
              opacity = 0.8;
              strokeWidth = 2;
              break;
            case 'suspicious':
              strokeColor = '#F59E0B';
              opacity = 0.6;
              strokeWidth = 1.5;
              break;
            default:
              strokeColor = '#10B981';
              opacity = 0.5;
              strokeWidth = 1.2;
          }
        }

        connections.push(
          <line
            key={`input-${fromIndex}-hidden-${toIndex}`}
            x1={fromX}
            y1={fromY}
            x2={toX}
            y2={toY}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
      });
    });

    // Hidden to Output connections - structured flow
    hiddenNeurons.forEach((fromNeuron, fromIndex) => {
      if (!layerVisibility.hidden) return;
      
      const fromY = 100 + (fromIndex * 30);
      const fromX = layerPositions.hidden;

      // Connect each hidden neuron to 1-2 output neurons in a structured way
      const targetOutputIndex = Math.floor(fromIndex / 2) % outputNeurons.length;
      
      if (targetOutputIndex >= outputNeurons.length) return;
      const toNeuron = outputNeurons[targetOutputIndex];
      if (!layerVisibility.output) return;

      const toY = 140 + (targetOutputIndex * 60);
      const toX = layerPositions.output;

      const isActive = fromNeuron.lastFired && (Date.now() / 1000) - fromNeuron.lastFired < 2;
      
      let strokeColor = '#64748B';
      let strokeWidth = 1;
      let opacity = 0.3;

      if (isActive) {
        switch (fromNeuron.trafficState) {
          case 'anomaly':
            strokeColor = '#EF4444';
            opacity = 0.8;
            strokeWidth = 2;
            break;
          case 'suspicious':
            strokeColor = '#F59E0B';
            opacity = 0.6;
            strokeWidth = 1.5;
            break;
          default:
            strokeColor = '#3B82F6';
            opacity = 0.5;
            strokeWidth = 1.2;
        }
      }

      connections.push(
        <line
          key={`hidden-${fromIndex}-output-${targetOutputIndex}`}
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );
    });

    return connections;
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            <span className="font-semibold text-white">Neural Network Architecture</span>
            <Badge variant={isAnalysisActive ? "default" : "secondary"}>
              {isAnalysisActive ? "Processing" : "Idle"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-400" />
              <span>Anomaly: {(anomalyScore * 100).toFixed(1)}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-red-400" />
              <span>Threats: {activeThreats}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="flow-particles" className="text-slate-300 text-sm">Data Flow</Label>
            <Switch 
              id="flow-particles"
              checked={showFlowParticles}
              onCheckedChange={setShowFlowParticles}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="connections" className="text-slate-300 text-sm">Connections</Label>
            <Switch 
              id="connections"
              checked={showConnections}
              onCheckedChange={setShowConnections}
            />
          </div>
          
          <Button variant="outline" size="sm" onClick={handleExportData} className="text-slate-300 border-slate-600">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Main visualization area */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
        {/* Neural Activity Base Layer */}
        <NeuralActivityIndicator 
          isActive={isAnalysisActive}
          anomalyScore={anomalyScore}
        />
        
        {/* Neural Flow Particles Overlay */}
        {showFlowParticles && (
          <NeuralFlowParticles
            neurons={neurons}
            layerVisibility={layerVisibility}
            isActive={isAnalysisActive}
            anomalyScore={anomalyScore}
          />
        )}
        
        {/* Main Neural Network SVG */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 700 400" style={{ zIndex: 5 }}>
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
              fill="#64748B"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                opacity="0.6"
              />
            </marker>
          </defs>

          {/* Render connections first (behind neurons) */}
          {renderConnections()}

          {/* Render Input Layer */}
          {layerVisibility.input && (
            <g>
              <text x="150" y="80" textAnchor="middle" fill="#10B981" fontSize="16" fontWeight="bold">
                Input Layer
              </text>
              <text x="150" y="95" textAnchor="middle" fill="#64748B" fontSize="12">
                Data Ingestion
              </text>
              {inputNeurons.map((neuron, index) => 
                renderNeuron(neuron, 150, 120 + (index * 40))
              )}
            </g>
          )}

          {/* Render Hidden Layer */}
          {layerVisibility.hidden && (
            <g>
              <text x="350" y="80" textAnchor="middle" fill="#3B82F6" fontSize="16" fontWeight="bold">
                Hidden Layer
              </text>
              <text x="350" y="95" textAnchor="middle" fill="#64748B" fontSize="12">
                Processing & Analysis
              </text>
              {hiddenNeurons.map((neuron, index) => 
                renderNeuron(neuron, 350, 100 + (index * 30))
              )}
            </g>
          )}

          {/* Render Output Layer */}
          {layerVisibility.output && (
            <g>
              <text x="550" y="80" textAnchor="middle" fill="#8B5CF6" fontSize="16" fontWeight="bold">
                Output Layer
              </text>
              <text x="550" y="95" textAnchor="middle" fill="#64748B" fontSize="12">
                Threat Classification
              </text>
              {outputNeurons.map((neuron, index) => 
                renderNeuron(neuron, 550, 140 + (index * 60))
              )}
            </g>
          )}
        </svg>
        
        {/* Layer Controls */}
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
          <div className="text-sm font-medium text-slate-200 mb-3">Layer Visibility</div>
          {Object.entries(layerVisibility).map(([layer, visible]) => (
            <div key={layer} className="flex items-center gap-2 mb-2">
              <Switch
                id={layer}
                checked={visible}
                onCheckedChange={(checked) =>
                  setLayerVisibility(prev => ({ ...prev, [layer]: checked }))
                }
              />
              <Label htmlFor={layer} className="text-slate-300 capitalize text-sm">
                {layer}
              </Label>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg p-3 min-w-[200px] border border-slate-700">
          <div className="text-sm font-medium text-slate-200 mb-3">Legend</div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Input Neurons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Hidden Neurons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Output Neurons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Anomaly Detected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Suspicious Activity</span>
            </div>
          </div>
        </div>

        {/* Hover Info */}
        {hoverNeuron && (
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white max-w-xs border border-slate-600">
            <div className="font-medium text-slate-200">Neuron {hoverNeuron.id}</div>
            <div className="text-sm text-slate-400 mt-1">
              <div>Layer: <span className="text-slate-300">{hoverNeuron.layer}</span></div>
              <div>State: <span className="text-slate-300">{hoverNeuron.trafficState || 'normal'}</span></div>
              <div>Intensity: <span className="text-slate-300">{((hoverNeuron.intensity || 0) * 100).toFixed(1)}%</span></div>
              <div>Spikes: <span className="text-slate-300">{hoverNeuron.spikeCount || 0}</span></div>
              <div>Connections: <span className="text-slate-300">{hoverNeuron.connections?.length || 0}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NeuronFlowVisualization;
