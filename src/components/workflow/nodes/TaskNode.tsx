import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ClipboardList, User } from 'lucide-react';
import { TaskNodeData } from '@/types/workflow';
import { cn } from '@/lib/utils';

const TaskNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as TaskNodeData;
  
  return (
    <div className={cn(
      "workflow-node workflow-node-task",
      selected && "ring-2 ring-node-task ring-offset-2 ring-offset-canvas"
    )}>
      <Handle
        type="target"
        position={Position.Top}
        className="workflow-handle"
      />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-node-task/20">
          <ClipboardList className="w-4 h-4 text-node-task" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs font-medium text-muted-foreground">Task</span>
          <span className="text-sm font-semibold text-foreground truncate">{nodeData.title}</span>
          {nodeData.assignee && (
            <div className="flex items-center gap-1 mt-1">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate">{nodeData.assignee}</span>
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

export default memo(TaskNode);
