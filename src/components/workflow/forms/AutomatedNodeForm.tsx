import React, { useEffect, useState } from 'react';
import { AutomatedNodeData, AutomationAction } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/api/mockApi';
import { Loader2 } from 'lucide-react';

interface AutomatedNodeFormProps {
  data: AutomatedNodeData;
  onChange: (data: Partial<AutomatedNodeData>) => void;
}

export const AutomatedNodeForm: React.FC<AutomatedNodeFormProps> = ({ data, onChange }) => {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAutomations = async () => {
      try {
        const result = await api.getAutomations();
        setAutomations(result);
      } catch (error) {
        console.error('Failed to fetch automations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAutomations();
  }, []);

  const selectedAction = automations.find(a => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    const action = automations.find(a => a.id === actionId);
    const newParams: Record<string, string> = {};
    action?.params.forEach(param => {
      newParams[param] = data.actionParams[param] || '';
    });
    onChange({ actionId, actionParams: newParams });
  };

  const handleParamChange = (param: string, value: string) => {
    onChange({
      actionParams: { ...data.actionParams, [param]: value },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter action title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="action">Action</Label>
        <Select
          value={data.actionId}
          onValueChange={handleActionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an action" />
          </SelectTrigger>
          <SelectContent>
            {automations.map((action) => (
              <SelectItem key={action.id} value={action.id}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3">
          <Label className="text-muted-foreground">Action Parameters</Label>
          {selectedAction.params.map((param) => (
            <div key={param} className="space-y-1">
              <Label htmlFor={param} className="text-sm capitalize">
                {param.replace(/_/g, ' ')}
              </Label>
              <Input
                id={param}
                value={data.actionParams[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
