import { POST } from '../../src/app/api/extract/route';
import { NextRequest } from 'next/server';

describe('Extract API', () => {
  it('should reject request without file', async () => {
    const formData = new FormData();
    const req = new NextRequest('http://localhost/api/extract', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('No file provided');
  });
});