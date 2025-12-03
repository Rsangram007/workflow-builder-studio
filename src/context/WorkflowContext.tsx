import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  WorkflowNode, 
  WorkflowEdge, 
  WorkflowNodeData, 
  NodeType, 
  createDefaultNodeData,
  ValidationError 
} from '@/types/workflow';
import { v4 as uuidv4 } from 'uuid';
import { useReactFlow, Connection, addEdge } from '@xyflow/react';

interface WorkflowContextType {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  validationErrors: ValidationError[];
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<WorkflowEdge[]>>;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  onConnect: (connection: Connection) => void;
  validateWorkflow: () => ValidationError[];
  clearWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProviderInner: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const reactFlow = useReactFlow();

  const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: type,
      position,
      data: createDefaultNodeData(type),
    };
    setNodes(prev => [...prev, newNode]);
  }, []);

  const updateNodeData = useCallback((nodeId: string, data: Partial<WorkflowNodeData>) => {
    setNodes(prev => 
      prev.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...data } as WorkflowNodeData }
          : node
      )
    );
    // Update selected node if it's the one being edited
    setSelectedNode(prev => 
      prev?.id === nodeId 
        ? { ...prev, data: { ...prev.data, ...data } as WorkflowNodeData }
        : prev
    );
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setEdges(prev => prev.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const selectNode = useCallback((nodeId: string | null) => {
    if (nodeId === null) {
      setSelectedNode(null);
    } else {
      const node = nodes.find(n => n.id === nodeId);
      setSelectedNode(node || null);
    }
  }, [nodes]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges(prev => addEdge({
      ...connection,
      id: uuidv4(),
      type: 'smoothstep',
      animated: true,
    }, prev));
  }, []);

  const validateWorkflow = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    const startNodes = nodes.filter(n => n.data.type === 'start');
    const endNodes = nodes.filter(n => n.data.type === 'end');
    
    if (startNodes.length === 0) {
      errors.push({ message: 'Workflow must have a Start node', type: 'error' });
    }
    if (startNodes.length > 1) {
      errors.push({ 
        message: 'Workflow can only have one Start node', 
        type: 'error',
        nodeId: startNodes[1].id 
      });
    }
    if (endNodes.length === 0) {
      errors.push({ message: 'Workflow must have an End node', type: 'error' });
    }
    
    // Check Start node has outgoing connections
    startNodes.forEach(node => {
      const hasOutgoing = edges.some(e => e.source === node.id);
      if (!hasOutgoing && nodes.length > 1) {
        errors.push({ 
          message: 'Start node must have an outgoing connection', 
          type: 'error',
          nodeId: node.id 
        });
      }
    });
    
    // Check End node has incoming connections
    endNodes.forEach(node => {
      const hasIncoming = edges.some(e => e.target === node.id);
      if (!hasIncoming && nodes.length > 1) {
        errors.push({ 
          message: 'End node must have an incoming connection', 
          type: 'error',
          nodeId: node.id 
        });
      }
    });
    
    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    nodes.forEach(node => {
      if (!connectedNodeIds.has(node.id) && nodes.length > 1) {
        errors.push({ 
          message: `Node "${node.data.label}" is not connected`, 
          type: 'warning',
          nodeId: node.id 
        });
      }
    });
    
    setValidationErrors(errors);
    return errors;
  }, [nodes, edges]);

  const clearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setValidationErrors([]);
  }, []);

  return (
    <WorkflowContext.Provider value={{
      nodes,
      edges,
      selectedNode,
      validationErrors,
      setNodes,
      setEdges,
      addNode,
      updateNodeData,
      deleteNode,
      selectNode,
      onConnect,
      validateWorkflow,
      clearWorkflow,
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};
