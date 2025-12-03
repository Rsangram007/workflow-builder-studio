import { useState, useCallback } from 'react';
import { useWorkflow } from '@/context/WorkflowContext';
import { WorkflowNodeData } from '@/types/workflow';

export const useWorkflowDesigner = () => {
  const { selectedNode, selectNode, updateNodeData, deleteNode } = useWorkflow();
  const [showSandbox, setShowSandbox] = useState(false);

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    selectNode(nodeId);
    if (nodeId) {
      setShowSandbox(false);
    }
  }, [selectNode]);

  const handleNodeUpdate = useCallback((data: Partial<WorkflowNodeData>) => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, data);
    }
  }, [selectedNode, updateNodeData]);

  const handleNodeDelete = useCallback(() => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
    }
  }, [selectedNode, deleteNode]);

  const handleClosePanel = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return {
    selectedNode,
    showSandbox,
    setShowSandbox,
    handleNodeSelect,
    handleNodeUpdate,
    handleNodeDelete,
    handleClosePanel,
  };
};
