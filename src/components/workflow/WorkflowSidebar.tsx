import React from 'react';
import { NodePalette } from './NodePalette';
import { NodeType } from '@/types/workflow';
import { useWorkflow } from '@/context/WorkflowContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, AlertCircle, AlertTriangle } from 'lucide-react';

export const WorkflowSidebar: React.FC = () => {
  const { nodes, edges, validationErrors } = useWorkflow();

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const errorCount = validationErrors.filter(e => e.type === 'error').length;
  const warningCount = validationErrors.filter(e => e.type === 'warning').length;

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground">
          Workflow Builder
        </h2>
        <p className="text-xs text-sidebar-foreground/60 mt-1">
          Drag nodes to the canvas
        </p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <NodePalette onDragStart={handleDragStart} />
      </div>

      <Separator className="bg-sidebar-border" />

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sidebar-foreground/70">
          <Info className="w-4 h-4" />
          <span className="text-xs font-medium">Workflow Stats</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-sidebar-accent">
            <p className="text-xs text-sidebar-foreground/60">Nodes</p>
            <p className="text-lg font-semibold text-sidebar-foreground">{nodes.length}</p>
          </div>
          <div className="p-2 rounded-lg bg-sidebar-accent">
            <p className="text-xs text-sidebar-foreground/60">Connections</p>
            <p className="text-lg font-semibold text-sidebar-foreground">{edges.length}</p>
          </div>
        </div>

        {(errorCount > 0 || warningCount > 0) && (
          <div className="space-y-1">
            {errorCount > 0 && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">{errorCount} error(s)</span>
              </div>
            )}
            {warningCount > 0 && (
              <div className="flex items-center gap-2 text-node-approval">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-xs">{warningCount} warning(s)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
