import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CheckCircle2, Shield } from 'lucide-react';
import { ApprovalNodeData } from '@/types/workflow';
import { cn } from '@/lib/utils';

const ApprovalNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as ApprovalNodeData;
  
  return (
    <div className={cn(
      "workflow-node workflow-node-approval",
      selected && "ring-2 ring-node-approval ring-offset-2 ring-offset-canvas"
    )}>
      <Handle
        type="target"
        position={Position.Top}
        className="workflow-handle"
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-node-approval/20">
          <CheckCircle2 className="w-4 h-4 text-node-approval" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs font-medium text-muted-foreground">Approval</span>
          <span className="text-sm font-semibold text-foreground truncate">{nodeData.title}</span>
          <div className="flex items-center gap-1 mt-1">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{nodeData.approverRole}</span>
          </div>
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

export default memo(ApprovalNode);
