import React from 'react';
import { WorkflowNode, WorkflowNodeData, StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '@/types/workflow';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedNodeForm } from './AutomatedNodeForm';
import { EndNodeForm } from './EndNodeForm';
import { Button } from '@/components/ui/button';
import { X, Trash2, Play, ClipboardList, CheckCircle2, Zap, Square } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NodeFormPanelProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<WorkflowNodeData>) => void;
  onDelete: () => void;
  onClose: () => void;
}

const nodeIcons = {
  start: Play,
  task: ClipboardList,
  approval: CheckCircle2,
  automated: Zap,
  end: Square,
};

const nodeLabels = {
  start: 'Start Node',
  task: 'Task Node',
  approval: 'Approval Node',
  automated: 'Automated Step',
  end: 'End Node',
};

export const NodeFormPanel: React.FC<NodeFormPanelProps> = ({
  node,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const Icon = nodeIcons[node.data.type];
  
  const renderForm = () => {
    switch (node.data.type) {
      case 'start':
        return (
          <StartNodeForm
            data={node.data as StartNodeData}
            onChange={onUpdate}
          />
        );
      case 'task':
        return (
          <TaskNodeForm
            data={node.data as TaskNodeData}
            onChange={onUpdate}
          />
        );
      case 'approval':
        return (
          <ApprovalNodeForm
            data={node.data as ApprovalNodeData}
            onChange={onUpdate}
          />
        );
      case 'automated':
        return (
          <AutomatedNodeForm
            data={node.data as AutomatedNodeData}
            onChange={onUpdate}
          />
        );
      case 'end':
        return (
          <EndNodeForm
            data={node.data as EndNodeData}
            onChange={onUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md bg-node-${node.data.type}/20`}>
            <Icon className={`w-4 h-4 text-node-${node.data.type}`} />
          </div>
          <span className="font-semibold text-foreground">
            {nodeLabels[node.data.type]}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {renderForm()}
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <Button
          variant="destructive"
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
};
