import { describe, expect, it } from 'vitest';
import { pdfUrl } from '../lib/api/client';

describe('api client helpers', () => {
  it('builds public pdf download urls under the real backend path', () => {
    expect(pdfUrl('abc')).toContain('/api/documents/pdf/abc');
  });
});

