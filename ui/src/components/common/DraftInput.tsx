import React, { ChangeEvent } from 'react';
// CORRECTED IMPORT: Directly from core, no engine subfolder
import { useDraft } from '@/core/StateManager';

interface DraftInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
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
  const { data, draft } = useDraft();
  
  // Source of Truth (Committed State)
  const committedValue = data[name] || '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    draft[name] = e.target.value;
    if (rest.onChange) rest.onChange(e);
  };

  return (
    <div className={`form-field-group ${error ? 'has-error' : ''}`}>
      {label && <label htmlFor={name} className="field-label">{label}</label>}
      
      <input
        {...rest}
        id={name}
        name={name}
        type={type}
        key={`${name}-${committedValue}`} // Reset logic
        defaultValue={committedValue}     // Uncontrolled binding
        onChange={handleChange}
        className={`draft-input ${className}`}
      />
      
      {error && <span className="field-error-text">{error}</span>}
    </div>
  );
};
