import type { Database } from "@/src/types/database";
import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export const getProfileByUserId = async (userId: string) => {
  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data satisfies ProfileRow | null;
};
