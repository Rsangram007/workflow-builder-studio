import React from 'react';
import { NodeType } from '@/types/workflow';
import { Play, ClipboardList, CheckCircle2, Zap, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

const nodeItems: { type: NodeType; label: string; icon: React.ElementType; description: string }[] = [
  { type: 'start', label: 'Start', icon: Play, description: 'Workflow entry point' },
  { type: 'task', label: 'Task', icon: ClipboardList, description: 'Human task step' },
  { type: 'approval', label: 'Approval', icon: CheckCircle2, description: 'Approval gate' },
  { type: 'automated', label: 'Automated', icon: Zap, description: 'System action' },
  { type: 'end', label: 'End', icon: Square, description: 'Workflow completion' },
];

export const NodePalette: React.FC<NodePaletteProps> = ({ onDragStart }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2">
        Node Types
      </h3>
      <div className="space-y-1">
        {nodeItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg cursor-grab",
              "bg-sidebar-accent/50 hover:bg-sidebar-accent",
              "border border-transparent hover:border-sidebar-border",
              "transition-all duration-200",
              "active:cursor-grabbing"
            )}
          >
            <div className={`p-2 rounded-md bg-node-${item.type}/20`}>
              <item.icon className={`w-4 h-4 text-node-${item.type}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">
                {item.label}
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                {item.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
