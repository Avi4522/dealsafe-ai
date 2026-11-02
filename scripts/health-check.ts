// scripts/health-check.ts
// Run with: npx ts-node --compiler-options '{"module":"commonjs","target":"ES2020"}' scripts/health-check.ts

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env manually
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function healthCheck() {
  console.log('🔍 DealSafe AI - Connection Health Check\n');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  console.log('✅ Environment variables present');

  // Test anon client connection
  try {
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await anonClient.from('profiles').select('count').limit(1);
    if (error) {
      console.log('⚠️  Anon client: Table access test failed (expected if RLS blocks anon):', error.message);
    } else {
      console.log('✅ Anon client: Connected successfully');
    }
  } catch (err) {
    console.error('❌ Anon client connection failed:', err);
  }

  // Test service role client connection
  if (supabaseServiceKey) {
    try {
      const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
      const { data, error } = await serviceClient.from('profiles').select('count').limit(1);
      if (error) {
        console.error('❌ Service client: Table access failed:', error.message);
      } else {
        console.log('✅ Service client: Connected successfully');
      }
    } catch (err) {
      console.error('❌ Service client connection failed:', err);
    }
  } else {
    console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY not set (server-only operations will fail)');
  }

  // Check storage bucket
  try {
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
    const { data: buckets, error } = await serviceClient.storage.listBuckets();
    if (error) {
      console.error('❌ Storage bucket check failed:', error.message);
    } else {
      const contractsBucket = buckets?.find((b: any) => b.id === 'contracts');
      if (contractsBucket) {
        console.log('✅ Storage bucket "contracts" exists');
        console.log(`   - Public: ${contractsBucket.public}`);
        console.log(`   - Size limit: ${contractsBucket.file_size_limit} bytes`);
      } else {
        console.log('⚠️  Storage bucket "contracts" not found (run migrations first)');
      }
    }
  } catch (err) {
    console.error('❌ Storage check failed:', err);
  }

  console.log('\n✅ Health check complete');
}

healthCheck().catch(console.error);
