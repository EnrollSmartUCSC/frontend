import { test, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import Home from '../src/app/page';

beforeEach(() => {
  cleanup();
});

test('Renders', async () => {
  render(<Home />);
});