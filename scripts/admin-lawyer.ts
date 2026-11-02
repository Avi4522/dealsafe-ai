// scripts/admin-lawyer.ts
// Usage: npx ts-node scripts/admin-lawyer.ts add "Name" "City" "specialty1,specialty2" "en,hi" "email@example.com" "+91-..." "BAR123" "verified note"
// Or: npx ts-node scripts/admin-lawyer.ts verify <lawyer-uuid>

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addLawyer(args: string[]) {
  const [name, city, specialties, languages, email, phone, barNo, note] = args;
  const { data, error } = await supabase
    .from('lawyers')
    .insert({
      name,
      city,
      specialties: specialties ? specialties.split(',') : [],
      languages: languages ? languages.split(',') : [],
      contact_email: email || null,
      contact_phone: phone || null,
      bar_registration_number: barNo || null,
      verified: false,
      short_note: note || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Lawyer added (unverified):', data.id);
  console.log('Run: npx ts-node scripts/admin-lawyer.ts verify', data.id);
}

async function verifyLawyer(id: string) {
  const { data, error } = await supabase
    .from('lawyers')
    .update({ verified: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  console.log('Lawyer verified:', data.name, '-', data.city);
}

async function main() {
  const cmd = process.argv[2];
  if (cmd === 'add') {
    await addLawyer(process.argv.slice(3));
  } else if (cmd === 'verify') {
    await verifyLawyer(process.argv[3]);
  } else {
    console.log('Usage:');
    console.log('  npx ts-node scripts/admin-lawyer.ts add "Name" "City" "spec1,spec2" "lang1,lang2" "email" "phone" "BAR123" "note"');
    console.log('  npx ts-node scripts/admin-lawyer.ts verify <uuid>');
  }
}

main().catch(console.error);
