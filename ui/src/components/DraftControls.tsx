import React from 'react';
import { useDraft, useControls } from '@/core/StateManager';

interface DraftControlsProps {
  saveLabel?: string;
  onSave?: () => void;
  hideUndo?: boolean;
  hideReset?: boolean;
}

export const DraftControls: React.FC<DraftControlsProps> = ({
  saveLabel = 'Save Changes',
  onSave,
  hideUndo = false,
  hideReset = false,
}) => {
  const { save } = useDraft();
  const { undo, reset, isDirty } = useControls();

  const handleSave = () => {
    save();
    if (onSave) onSave();
  };

  // Inline styles for basic layout (replace with CSS classes in production)
  const containerStyle = {
    display: 'flex', 
    gap: '10px', 
    marginTop: '20px', 
    paddingTop: '20px', 
    borderTop: '1px solid #eee'
  };

  return (
    <div className="draft-controls" style={containerStyle}>
      {!hideReset && (
        <button onClick={reset} type="button">Reset</button>
      )}
      
      {!hideUndo && (
        <button onClick={undo} type="button">Undo</button>
      )}
      
      <button 
        onClick={handleSave} 
        disabled={!isDirty}
        style={{ marginLeft: 'auto', fontWeight: 'bold' }} // Push Save to the right
      >
        {saveLabel}
      </button>
    </div>
  );
};
