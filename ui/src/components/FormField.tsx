import React, { ReactNode } from 'react';

interface FormFieldProps {
  /** The text to display above the input */
  label?: string;
  /** The input element itself */
  children: ReactNode;
  /** Optional error message to show in red */
  error?: string;
  /** Optional extra CSS class */
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  children, 
  error, 
  className = '' 
}) => {
  return (
    <div className={`form-field-group ${className}`} style={{ marginBottom: '1rem' }}>
      {/* 1. Render Label */}
      {label && (
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
          {label}
        </label>
      )}
      
      {/* 2. Render the Input (The 'Children') */}
      {children}

      {/* 3. Render Error Message */}
      {error && (
        <span style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};
