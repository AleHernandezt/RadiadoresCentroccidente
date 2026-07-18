import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rktjpbwrlqyofldzlmmd.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZxAcr6AI1LBgtPbtP5EznQ_vySN87Nw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
