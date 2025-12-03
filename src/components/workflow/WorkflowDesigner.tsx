import React, { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowProviderInner } from '@/context/WorkflowContext';
import { WorkflowHeader } from './WorkflowHeader';
import { WorkflowSidebar } from './WorkflowSidebar';
import { WorkflowCanvas } from './WorkflowCanvas';
import { WorkflowSandbox } from './WorkflowSandbox';
import { NodeFormPanel } from './forms/NodeFormPanel';
import { useWorkflowDesigner } from '@/hooks/useWorkflowDesigner';

const WorkflowDesignerContent: React.FC = () => {
  const {
    selectedNode,
    showSandbox,
    setShowSandbox,
    handleNodeSelect,
    handleNodeUpdate,
    handleNodeDelete,
    handleClosePanel,
  } = useWorkflowDesigner();

  return (
    <div className="h-screen flex flex-col bg-background">
      <WorkflowHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <WorkflowSidebar />
        
        <main className="flex-1 relative">
          <WorkflowCanvas onNodeSelect={handleNodeSelect} />
          
          {/* Toggle sandbox button */}
          <button
            onClick={() => setShowSandbox(!showSandbox)}
            className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            {showSandbox ? 'Hide Sandbox' : 'Test Workflow'}
          </button>
        </main>
        
        {/* Right panel - either form or sandbox */}
        {(selectedNode || showSandbox) && (
          <div className="w-80">
            {selectedNode ? (
              <NodeFormPanel
                node={selectedNode}
                onUpdate={handleNodeUpdate}
                onDelete={handleNodeDelete}
                onClose={handleClosePanel}
              />
            ) : (
              <WorkflowSandbox />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const WorkflowDesigner: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowProviderInner>
        <WorkflowDesignerContent />
      </WorkflowProviderInner>
    </ReactFlowProvider>
  );
};
