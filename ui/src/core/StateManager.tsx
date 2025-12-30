import React, { createContext, useState, useRef, useCallback, useMemo, useContext, ReactNode } from 'react';
// IMPORT UPDATE: Points to 'StateEngine' and uses 'createDraft'
import { createSecureCopy, createDraft } from './StateEngine';

// --- TYPES ---
interface StateContextType<T> {
  data: T;
  draft: T;
  buffer: React.MutableRefObject<Partial<T>>;
  save: (overrideData?: Partial<T> | null) => void;
  undo: () => void;
  reset: () => void;
  checkDirty: () => boolean;
  defaults: T;
}

const StateContext = createContext<StateContextType<any> | null>(null);

interface StateProviderProps<T> {
  initialState: T;
  children: ReactNode;
}

// --- MAIN COMPONENT ---
export const StateProvider = <T extends Record<string, any>>({ 
  initialState, 
  children 
}: StateProviderProps<T>) => {
  
  const [committedState, setCommittedState] = useState<T>(initialState); 
  const pendingBuffer = useRef<Partial<T>>({});                                   
  const historyCheckpoint = useRef<T>(createSecureCopy(initialState));   

  // DRAFT CREATION (Updated Function Name)
  const draft = useMemo(() => {
    return createDraft(pendingBuffer, committedState);
  }, [committedState]);

  // SAVE ACTION
  const save = useCallback((overrideData: Partial<T> | null = null) => {
    historyCheckpoint.current = createSecureCopy(committedState);

    let finalState: T;

    if (overrideData) {
      finalState = { ...committedState, ...overrideData };
      pendingBuffer.current = {}; 
    } else {
      finalState = { ...committedState, ...pendingBuffer.current };
      pendingBuffer.current = {}; 
    }

    setCommittedState(finalState);
  }, [committedState]);

  // UNDO ACTION
  const undo = useCallback(() => {
    const previousVersion = historyCheckpoint.current;
    historyCheckpoint.current = createSecureCopy(committedState);
    setCommittedState(previousVersion);
  }, [committedState]);

  // RESET ACTION
  const reset = useCallback(() => {
    historyCheckpoint.current = createSecureCopy(committedState);
    pendingBuffer.current = {};
    setCommittedState(createSecureCopy(initialState));
  }, [committedState, initialState]);

  const checkDirty = useCallback(() => {
    return Object.keys(pendingBuffer.current).length > 0;
  }, []);

  const contextValue: StateContextType<T> = {
    data: committedState,
    draft,
    buffer: pendingBuffer,
    save,
    undo,
    reset,
    checkDirty,
    defaults: initialState
  };

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

// --- HOOKS ---

export const useDraft = <T extends Record<string, any>>() => {
  const context = useContext(StateContext);
  if (!context) throw new Error('useDraft must be used within StateProvider');
  
  return { 
    data: context.data as T, 
    draft: context.draft as T, 
    save: context.save 
  };
};

export const useControls = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error('useControls must be used within StateProvider');
  
  const { undo, reset, checkDirty, buffer, defaults } = context;

  return { 
    undo, 
    reset, 
    isDirty: checkDirty(), 
    tempBuffer: buffer,
    initialState: defaults
  };
};
