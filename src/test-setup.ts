import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

if (!URL.createObjectURL) URL.createObjectURL = () => 'blob:test-preview';
if (!URL.revokeObjectURL) URL.revokeObjectURL = () => undefined;

afterEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
});
