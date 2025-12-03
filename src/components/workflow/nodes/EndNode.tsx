import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Square, FileText } from 'lucide-react';
import { EndNodeData } from '@/types/workflow';
import { cn } from '@/lib/utils';

const EndNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as EndNodeData;
  
  return (
    <div className={cn(
      "workflow-node workflow-node-end",
      selected && "ring-2 ring-node-end ring-offset-2 ring-offset-canvas"
    )}>
      <Handle
        type="target"
        position={Position.Top}
        className="workflow-handle"
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-node-end/20">
          <Square className="w-4 h-4 text-node-end" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs font-medium text-muted-foreground">End</span>
          <span className="text-sm font-semibold text-foreground truncate">
            {nodeData.endMessage || 'Workflow End'}
          </span>
          {nodeData.showSummary && (
            <div className="flex items-center gap-1 mt-1">
              <FileText className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Show summary</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(EndNode);
