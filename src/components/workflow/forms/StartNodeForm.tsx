import React from 'react';
import { StartNodeData, KeyValuePair } from '@/types/workflow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface StartNodeFormProps {
  data: StartNodeData;
  onChange: (data: Partial<StartNodeData>) => void;
}

export const StartNodeForm: React.FC<StartNodeFormProps> = ({ data, onChange }) => {
  const addMetadata = () => {
    onChange({
      metadata: [...data.metadata, { key: '', value: '' }],
    });
  };

  const updateMetadata = (index: number, field: 'key' | 'value', value: string) => {
    const newMetadata = [...data.metadata];
    newMetadata[index] = { ...newMetadata[index], [field]: value };
    onChange({ metadata: newMetadata });
  };

  const removeMetadata = (index: number) => {
    onChange({
      metadata: data.metadata.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Start Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter workflow start title"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Metadata (Key-Value Pairs)</Label>
          <Button variant="ghost" size="sm" onClick={addMetadata}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        {data.metadata.length === 0 ? (
          <p className="text-sm text-muted-foreground">No metadata defined</p>
        ) : (
          <div className="space-y-2">
            {data.metadata.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item.key}
                  onChange={(e) => updateMetadata(index, 'key', e.target.value)}
                  placeholder="Key"
                  className="flex-1"
                />
                <Input
                  value={item.value}
                  onChange={(e) => updateMetadata(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMetadata(index)}
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
