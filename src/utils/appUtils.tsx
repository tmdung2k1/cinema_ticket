import config from '../config';
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(config.VITE_SUPABASE_URL, config.VITE_SUPABASE_PUBLISHABLE_KEY);