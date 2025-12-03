import { AutomationAction, SimulationResult, SimulationStep, Workflow, WorkflowNode, AutomatedNodeData } from '@/types/workflow';

// Mock automation actions available in the system
const mockAutomations: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create Support Ticket', params: ['title', 'priority'] },
  { id: 'update_record', label: 'Update HR Record', params: ['field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'duration'] },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // GET /automations - Returns available automation actions
  getAutomations: async (): Promise<AutomationAction[]> => {
    await delay(300);
    return mockAutomations;
  },

  // POST /simulate - Simulates workflow execution
  simulate: async (workflow: Workflow): Promise<SimulationResult> => {
    await delay(500);
    
    const errors: string[] = [];
    const steps: SimulationStep[] = [];
    
    // Validate workflow structure
    const startNodes = workflow.nodes.filter(n => n.data.type === 'start');
    const endNodes = workflow.nodes.filter(n => n.data.type === 'end');
    
    if (startNodes.length === 0) {
      errors.push('Workflow must have a Start node');
    }
    if (startNodes.length > 1) {
      errors.push('Workflow can only have one Start node');
    }
    if (endNodes.length === 0) {
      errors.push('Workflow must have an End node');
    }
    
    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    workflow.edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    workflow.nodes.forEach(node => {
      if (!connectedNodeIds.has(node.id) && workflow.nodes.length > 1) {
        errors.push(`Node "${node.data.label}" is not connected`);
      }
    });
    
    // Check for cycles (simple check)
    const visited = new Set<string>();
    const checkCycle = (nodeId: string, path: Set<string>): boolean => {
      if (path.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      
      visited.add(nodeId);
      path.add(nodeId);
      
      const outgoingEdges = workflow.edges.filter(e => e.source === nodeId);
      for (const edge of outgoingEdges) {
        if (checkCycle(edge.target, new Set(path))) {
          return true;
        }
      }
      
      return false;
    };
    
    if (startNodes.length > 0) {
      if (checkCycle(startNodes[0].id, new Set())) {
        errors.push('Workflow contains a cycle');
      }
    }
    
    if (errors.length > 0) {
      return { success: false, steps: [], errors };
    }
    
    // Simulate execution order using BFS from start node
    const getExecutionOrder = (): WorkflowNode[] => {
      const order: WorkflowNode[] = [];
      const queue: string[] = [startNodes[0].id];
      const processedIds = new Set<string>();
      
      while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (processedIds.has(currentId)) continue;
        
        const node = workflow.nodes.find(n => n.id === currentId);
        if (node) {
          order.push(node);
          processedIds.add(currentId);
          
          const outgoingEdges = workflow.edges.filter(e => e.source === currentId);
          outgoingEdges.forEach(edge => {
            if (!processedIds.has(edge.target)) {
              queue.push(edge.target);
            }
          });
        }
      }
      
      return order;
    };
    
    const executionOrder = getExecutionOrder();
    let timestamp = Date.now();
    
    for (const node of executionOrder) {
      const nodeData = node.data;
      const step: SimulationStep = {
        nodeId: node.id,
        nodeType: nodeData.type,
        title: 'title' in nodeData ? (nodeData.title as string) : nodeData.label,
        status: 'completed',
        message: '',
        timestamp: timestamp,
      };
      
      switch (nodeData.type) {
        case 'start':
          step.message = `Workflow started: ${nodeData.title}`;
          break;
        case 'task':
          step.message = `Task "${nodeData.title}" assigned to ${nodeData.assignee || 'Unassigned'}`;
          break;
        case 'approval':
          step.message = `Approval requested from ${nodeData.approverRole}`;
          break;
        case 'automated':
          const automatedData = nodeData as AutomatedNodeData;
          const action = mockAutomations.find(a => a.id === automatedData.actionId);
          step.message = `Executed: ${action?.label || 'Unknown action'}`;
          break;
        case 'end':
          step.message = nodeData.endMessage;
          break;
      }
      
      steps.push(step);
      timestamp += 1000; // Add 1 second between steps
    }
    
    return { success: true, steps, errors: [] };
  },
};
