'use client';

import { MultiSelect, Option } from '@/components/atom/multi-select';
import { INTERESTS } from './constant';
import { Label } from '@/components/ui/label';

interface InterestsProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function Interests({ value, onChange }: InterestsProps) {
  const interestOptions: Option[] = INTERESTS.map(interest => ({
    value: interest,
    label: interest
  }));

  const selectedOptions = value.map(interest => ({
    value: interest,
    label: interest
  }));

  const handleChange = (selected: Option[]) => {
    onChange(selected.map(option => option.value));
  };

  return (
    <div className="space-y-2">
      <Label>الاهتمامات</Label>
      <MultiSelect
        options={interestOptions}
        selected={selectedOptions}
        onChange={handleChange}
        placeholder="اختر اهتماماتك..."
      />
    </div>
  );
} 