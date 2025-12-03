import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap, Settings } from 'lucide-react';
import { AutomatedNodeData } from '@/types/workflow';
import { cn } from '@/lib/utils';

const AutomatedNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as AutomatedNodeData;
  
  return (
    <div className={cn(
      "workflow-node workflow-node-automated",
      selected && "ring-2 ring-node-automated ring-offset-2 ring-offset-canvas"
    )}>
      <Handle
        type="target"
        position={Position.Top}
        className="workflow-handle"
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-node-automated/20">
          <Zap className="w-4 h-4 text-node-automated" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs font-medium text-muted-foreground">Automated</span>
          <span className="text-sm font-semibold text-foreground truncate">{nodeData.title}</span>
          {nodeData.actionId && (
            <div className="flex items-center gap-1 mt-1">
              <Settings className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate">{nodeData.actionId}</span>
            </div>
          )}
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

export default memo(AutomatedNode);
