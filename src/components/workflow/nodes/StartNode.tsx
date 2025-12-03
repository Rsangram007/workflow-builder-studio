import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import { StartNodeData } from '@/types/workflow';
import { cn } from '@/lib/utils';

const StartNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as StartNodeData;
  
  return (
    <div className={cn(
      "workflow-node workflow-node-start",
      selected && "ring-2 ring-node-start ring-offset-2 ring-offset-canvas"
    )}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-node-start/20">
          <Play className="w-4 h-4 text-node-start" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">Start</span>
          <span className="text-sm font-semibold text-foreground">{nodeData.title}</span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="workflow-handle"
      />
    </div>
  );
};

export default memo(StartNode);
