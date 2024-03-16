import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/database.types";

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string,
);
