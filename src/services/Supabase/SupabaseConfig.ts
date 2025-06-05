import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xpdtheacswwobyzmiecd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZHRoZWFjc3d3b2J5em1pZWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjg2OTMsImV4cCI6MjA2NDY0NDY5M30.SA2pOER8w5mIc7Eaxis5pBN1n9qLDXv1XN_Ym8DpwRw";  

export const supabase = createClient(supabaseUrl, supabaseKey);
