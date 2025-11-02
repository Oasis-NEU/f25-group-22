import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = "https://your-project.supabase.co";
const supabaseKey = "your-anon-key";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
