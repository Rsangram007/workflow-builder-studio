import React from 'react';
import { TaskNodeData } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface TaskNodeFormProps {
  data: TaskNodeData;
  onChange: (data: Partial<TaskNodeData>) => void;
}

export const TaskNodeForm: React.FC<TaskNodeFormProps> = ({ data, onChange }) => {
  const addCustomField = () => {
    onChange({
      customFields: [...data.customFields, { key: '', value: '' }],
    });
  };

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    const newFields = [...data.customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    onChange({ customFields: newFields });
  };

  const removeCustomField = (index: number) => {
    onChange({
      customFields: data.customFields.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Input
          id="assignee"
          value={data.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })}
          placeholder="Enter assignee name or email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={data.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Custom Fields</Label>
          <Button variant="ghost" size="sm" onClick={addCustomField}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        {data.customFields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No custom fields</p>
        ) : (
          <div className="space-y-2">
            {data.customFields.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item.key}
                  onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                  placeholder="Field name"
                  className="flex-1"
                />
                <Input
                  value={item.value}
                  onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomField(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
