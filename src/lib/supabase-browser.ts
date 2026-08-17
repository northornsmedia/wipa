import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton browser client for client components
// This automatically handles session storage in localStorage
let browserClient: ReturnType<typeof createClient> | undefined;

export const getSupabaseBrowserClient = (): any => {
  if (browserClient) return browserClient;
  
  browserClient = createClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
};

// Export a default instance for convenience
export const supabase: any = getSupabaseBrowserClient();
