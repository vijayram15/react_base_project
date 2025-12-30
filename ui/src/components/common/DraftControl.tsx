import React from 'react';
// CORRECTED IMPORT: Directly from core
import { useDraft, useControls } from '@/core/StateManager';

interface DraftControlsProps {
  saveLabel?: string;
  onSave?: () => void;
  hideUndo?: boolean;
  hideReset?: boolean;
  isSubmitting?: boolean;
}

export const DraftControls: React.FC<DraftControlsProps> = ({
  saveLabel = 'Save Changes',
  onSave,
  hideUndo = false,
  hideReset = false,
  isSubmitting = false,
}) => {
  const { save } = useDraft();
  const { undo, reset, isDirty } = useControls();

  const handleSave = () => {
    save();
    if (onSave) onSave();
  };

  return (
    <div className="draft-controls-toolbar">
      <div className="controls-left">
        {isDirty && <span className="status-dirty">● Unsaved changes</span>}
      </div>

      <div className="controls-right">
        {!hideReset && (
          <button 
            type="button" 
            onClick={reset}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Reset
          </button>
        )}

        {!hideUndo && (
          <button 
            type="button" 
            onClick={undo}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Undo
          </button>
        )}

        <button 
          type="button" 
          onClick={handleSave}
          disabled={!isDirty || isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? 'Saving...' : saveLabel}
        </button>
      </div>
    </div>
  );
};
