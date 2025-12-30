import React, { ChangeEvent } from 'react';
import { useDraft } from '@/core/StateManager';
import { FormField } from './FormField'; // Importing the layout container

interface DraftInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The property name in the state object (e.g., "firstName") */
  name: string;
  /** Label passed down to the FormField */
  label?: string;
  /** Error passed down to the FormField */
  error?: string;
}

export const DraftInput: React.FC<DraftInputProps> = ({ 
  name, 
  label, 
  error,
  className = '', 
  type = 'text',
  ...rest 
}) => {
  // 1. Hook into Core Logic
  const { data, draft } = useDraft();
  const committedValue = data[name] || '';

  // 2. Handle Typing
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    draft[name] = e.target.value;
    if (rest.onChange) rest.onChange(e);
  };

  return (
    // 3. COMPOSITION: Wrap the raw input in the FormField container
    <FormField label={label} error={error} className={className}>
      <input
        {...rest}
        id={name}
        name={name}
        type={type}
        // Key Reset Pattern
        key={`${name}-${committedValue}`}
        defaultValue={committedValue}
        onChange={handleChange}
        style={{ 
          width: '100%', 
          padding: '8px', 
          borderRadius: '4px', 
          border: '1px solid #ccc' 
        }}
      />
    </FormField>
  );
};
