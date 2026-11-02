import '@testing-library/jest-dom';
import 'openai/shims/node';

// Restore globals for jsdom
import { Request, Response, Headers, fetch } from 'undici';
globalThis.Request = Request as any;
globalThis.Response = Response as any;
globalThis.Headers = Headers as any;
globalThis.fetch = fetch as any;

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      ilike: jest.fn().mockResolvedValue({ data: [], error: null }),
      limit: jest.fn().mockReturnThis(),
    })),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  },
  getServiceRoleSupabase: jest.fn(),
}));

// Mock Stripe
jest.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          url: 'https://checkout.stripe.com/test',
          id: 'cs_test_123',
        }),
        retrieve: jest.fn().mockResolvedValue({
          payment_status: 'paid',
          metadata: { userId: 'user-1', planName: 'Pro Plan' },
        }),
      },
    },
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({ type: 'invoice.payment_succeeded' }),
    },
  },
}));

// Mock Razorpay
jest.mock('@/lib/razorpay', () => ({
  razorpay: {
    orders: {
      create: jest.fn().mockResolvedValue({
        id: 'order_123',
        amount: 2900,
        currency: 'USD',
      }),
    },
  },
}));

// Mock OpenAI
jest.mock('@/lib/openai', () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: '{"contract_type":"NDA","confidence":95}' } }],
        }),
      },
    },
  },
}));

// Mock @supabase/supabase-js (used directly in API routes)
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      ilike: jest.fn().mockResolvedValue({ data: [], error: null }),
      limit: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  })),
}));