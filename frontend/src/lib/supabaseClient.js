import { createClient } from "@supabase/supabase-js";

const url = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const supabaseReady = Boolean(supabase);

const TABLE = "blunder_state";
const ROW_ID = "singleton";

export async function fetchSharedState() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("data, updated_at")
    .eq("id", ROW_ID)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { state: data.data || {}, updatedAt: data.updated_at };
}

export async function saveSharedState(state) {
  if (!supabase) return null;
  const payload = {
    id: ROW_ID,
    data: state,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(payload, { onConflict: "id" })
    .select("updated_at")
    .single();
  if (error) throw error;
  return data?.updated_at;
}
