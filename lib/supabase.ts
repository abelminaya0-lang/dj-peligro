
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://buoaxbgpsnztantutbmd.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1b2F4Ymdwc256dGFudHV0Ym1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3Mzg3MTUsImV4cCI6MjA4NTMxNDcxNX0.7L8peTefTmII_wRKFQgB4jUQXEYvyK_BvEfFHcU-XBg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
