import React, { useState } from 'react';
import { useWorkflow } from '@/context/WorkflowContext';
import { api } from '@/api/mockApi';
import { SimulationResult, SimulationStep } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Play,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusIcons = {
  pending: Clock,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
};

const statusColors = {
  pending: 'text-muted-foreground',
  running: 'text-node-task',
  completed: 'text-node-start',
  failed: 'text-destructive',
};

export const WorkflowSandbox: React.FC = () => {
  const { nodes, edges, validateWorkflow } = useWorkflow();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [animatedSteps, setAnimatedSteps] = useState<SimulationStep[]>([]);

  const runSimulation = async () => {
    const errors = validateWorkflow();
    
    if (errors.filter(e => e.type === 'error').length > 0) {
      setResult({
        success: false,
        steps: [],
        errors: errors.filter(e => e.type === 'error').map(e => e.message),
      });
      return;
    }

    setIsRunning(true);
    setAnimatedSteps([]);
    setResult(null);

    try {
      const simulationResult = await api.simulate({ nodes, edges });
      
      // Animate steps one by one
      for (let i = 0; i < simulationResult.steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAnimatedSteps(prev => [...prev, simulationResult.steps[i]]);
      }
      
      setResult(simulationResult);
    } catch (error) {
      setResult({
        success: false,
        steps: [],
        errors: ['Simulation failed unexpectedly'],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setAnimatedSteps([]);
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Workflow Sandbox</h3>
        <div className="flex items-center gap-2">
          {result && (
            <Button variant="ghost" size="sm" onClick={clearResults}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            onClick={runSimulation}
            disabled={isRunning || nodes.length === 0}
            size="sm"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isRunning ? 'Running...' : 'Run Simulation'}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Add nodes to the canvas to run a simulation
            </p>
          </div>
        ) : animatedSteps.length === 0 && !result ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Play className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click "Run Simulation" to test your workflow
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {result?.errors && result.errors.length > 0 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span className="font-medium text-destructive">Validation Errors</span>
                </div>
                <ul className="space-y-1">
                  {result.errors.map((error, index) => (
                    <li key={index} className="text-sm text-destructive/80">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {animatedSteps.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Execution Timeline
                </h4>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-3">
                    {animatedSteps.map((step, index) => {
                      const Icon = statusIcons[step.status];
                      return (
                        <div
                          key={index}
                          className={cn(
                            "relative pl-10 animate-in slide-in-from-left-2 fade-in duration-300"
                          )}
                        >
                          <div className={cn(
                            "absolute left-2 top-1 p-1 rounded-full bg-card border-2 border-border",
                            step.status === 'completed' && "border-node-start",
                            step.status === 'failed' && "border-destructive"
                          )}>
                            <Icon className={cn(
                              "w-3 h-3",
                              statusColors[step.status],
                              step.status === 'running' && "animate-spin"
                            )} />
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50 border border-border">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-foreground">
                                {step.title}
                              </span>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full capitalize",
                                step.nodeType === 'start' && "bg-node-start/20 text-node-start",
                                step.nodeType === 'task' && "bg-node-task/20 text-node-task",
                                step.nodeType === 'approval' && "bg-node-approval/20 text-node-approval",
                                step.nodeType === 'automated' && "bg-node-automated/20 text-node-automated",
                                step.nodeType === 'end' && "bg-node-end/20 text-node-end"
                              )}>
                                {step.nodeType}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {step.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {result?.success && (
              <div className="p-3 rounded-lg bg-node-start/10 border border-node-start/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-node-start" />
                  <span className="font-medium text-node-start">
                    Simulation completed successfully!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
