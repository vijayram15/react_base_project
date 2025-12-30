import { cloneDeep, isEqual } from 'lodash';
import { MutableRefObject } from 'react';

// --- TYPES ---
type AnyObject = Record<string, any>;

/**
 * StateEngine.ts
 * RESPONSIBILITY: Low-level data mechanics.
 * 1. Data Integrity (Cloning, Diffing)
 * 2. Draft Creation (The "Editable" Interface)
 */

// --- JOB: DATA INTEGRITY ---

export const createSecureCopy = <T>(data: T): T => {
  return cloneDeep(data);
};

export const hasDataChanged = (original: AnyObject, current: AnyObject): boolean => {
  return !isEqual(original, current);
};

// --- JOB: DRAFT CREATION ---

/**
 * Creates the "Draft" object.
 * This intercepts assignments to allow silent editing.
 */
export const createDraft = <T extends AnyObject>(
  bufferRef: MutableRefObject<Partial<T>>,
  committedState: T
): T => {
  return new Proxy({} as T, {
    get: (target, prop: string | symbol) => {
      const key = prop as keyof T;
      
      // 1. Check Draft Buffer (Pending Changes)
      if (bufferRef.current && key in bufferRef.current) {
        return bufferRef.current[key];
      }
      
      // 2. Fallback to Committed Data (Read-Only)
      return committedState ? committedState[key] : undefined;
    },

    set: (target, prop: string | symbol, value: any) => {
      // 3. Silent Write to Buffer
      const key = prop as keyof T;
      bufferRef.current[key] = value;
      return true;
    }
  });
};
