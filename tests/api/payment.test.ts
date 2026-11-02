import { POST } from '../../src/app/api/payment/create-order/route';
import { NextRequest } from 'next/server';

describe('Payment API - Create Order', () => {
  it('should reject request without authorization', async () => {
    const req = new NextRequest('http://localhost/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planName: 'Pro Plan', billingCycle: 'monthly' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain('Unauthorized');
  });

  it('should reject invalid plan name', async () => {
    const req = new NextRequest('http://localhost/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer test-token'
      },
      body: JSON.stringify({ planName: 'Invalid Plan', billingCycle: 'monthly' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid plan name');
  });
});