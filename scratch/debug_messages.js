import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data: convs, error: convsErr } = await supabase.from('conversations').select('*');
  console.log("Conversations:", convs);

  if (convs && convs.length > 0) {
    const { data: msgs, error: msgsErr } = await supabase.from('messages').select('*').eq('conversation_id', convs[0].id);
    console.log("Messages for conv", convs[0].id, ":", msgs?.length);
  }
}
test();
