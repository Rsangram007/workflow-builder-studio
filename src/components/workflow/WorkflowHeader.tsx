import React from 'react';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { Workflow, Trash2, Download, Upload, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

export const WorkflowHeader: React.FC = () => {
  const { nodes, edges, clearWorkflow, validateWorkflow, setNodes, setEdges } = useWorkflow();

  const handleValidate = () => {
    const errors = validateWorkflow();
    if (errors.length === 0) {
      toast.success('Workflow is valid!');
    } else {
      const errorCount = errors.filter(e => e.type === 'error').length;
      const warningCount = errors.filter(e => e.type === 'warning').length;
      toast.error(`Found ${errorCount} error(s) and ${warningCount} warning(s)`);
    }
  };

  const handleExport = () => {
    const workflow = { nodes, edges };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Workflow exported!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const workflow = JSON.parse(text);
          if (workflow.nodes && workflow.edges) {
            setNodes(workflow.nodes);
            setEdges(workflow.edges);
            toast.success('Workflow imported!');
          } else {
            toast.error('Invalid workflow file');
          }
        } catch {
          toast.error('Failed to parse workflow file');
        }
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (nodes.length === 0) return;
    clearWorkflow();
    toast.success('Canvas cleared');
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Workflow className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">HR Workflow Designer</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleValidate}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Validate
            </Button>
          </TooltipTrigger>
          <TooltipContent>Check workflow for errors</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import workflow from JSON</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={nodes.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export workflow as JSON</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={nodes.length === 0}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear all nodes</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};
