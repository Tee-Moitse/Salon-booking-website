
// supabaseClient.js


// Import Supabase library
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js';

// Replace with your project URL and anon key
const SUPABASE_URL = "https://tdyvxqdjlxkrswsokehu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeXZ4cWRqbHhrcnN3c29rZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMjcwMzEsImV4cCI6MjA3ODkwMzAzMX0.gj47FM38iplZecS9s9utFWeGuRZ3tt1OPT-5eUzW_4k";

// Create a Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
