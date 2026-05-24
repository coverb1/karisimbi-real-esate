import { createClient } from "@supabase/supabase-js";

import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/src/lib/env";
import type { Database } from "@/src/types/database";

const serverClientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

export const getSupabaseServerClient = () =>
  createClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    serverClientOptions,
  );

export const getSupabaseServiceRoleClient = () =>
  createClient<Database>(
    getSupabaseUrl(),
    getSupabaseServiceRoleKey(),
    serverClientOptions,
  );
