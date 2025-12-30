import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Runs a cleanup after each test case (e.g., clearing jsdom)
// This ensures that one test doesn't affect the next.
afterEach(() => {
  cleanup();
});
