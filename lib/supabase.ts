import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Supabase env vars are missing. Storage actions will fail until configured.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false
  }
});

export const storageBucket = process.env.SUPABASE_BUCKET ?? 'tagify-files';
