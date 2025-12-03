import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './nodes';
import { useWorkflow } from '@/context/WorkflowContext';
import { NodeType } from '@/types/workflow';

interface WorkflowCanvasProps {
  onNodeSelect: (nodeId: string | null) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ onNodeSelect }) => {
  const { nodes, edges, setNodes, setEdges, onConnect, addNode } = useWorkflow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as typeof nds);
    },
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (!type || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 25,
      };

      addNode(type, position);
    },
    [addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        className="bg-canvas"
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background color="hsl(var(--muted-foreground) / 0.1)" gap={20} />
        <Controls className="bg-card border border-border rounded-lg" />
        <MiniMap
          className="bg-card border border-border rounded-lg"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              start: 'hsl(var(--node-start))',
              task: 'hsl(var(--node-task))',
              approval: 'hsl(var(--node-approval))',
              automated: 'hsl(var(--node-automated))',
              end: 'hsl(var(--node-end))',
            };
            return colors[node.type || ''] || 'hsl(var(--muted))';
          }}
        />
      </ReactFlow>
    </div>
  );
};
