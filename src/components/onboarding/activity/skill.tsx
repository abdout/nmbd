'use client';

import { MultiSelect, Option } from '@/components/atom/multi-select';
import { SKILLS } from './constant';
import { Label } from '@/components/ui/label';

interface SkillsProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function Skills({ value, onChange }: SkillsProps) {
  const skillOptions: Option[] = SKILLS.map(skill => ({
    value: skill,
    label: skill
  }));

  const selectedOptions = value.map(skill => ({
    value: skill,
    label: skill
  }));

  const handleChange = (selected: Option[]) => {
    onChange(selected.map(option => option.value));
  };

  return (
    <div className="space-y-2">
      <Label>المهارات</Label>
      <MultiSelect
        options={skillOptions}
        selected={selectedOptions}
        onChange={handleChange}
        placeholder="اختر مهاراتك..."
      />
    </div>
  );
} 