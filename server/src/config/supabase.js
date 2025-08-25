const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with service role for server-side operations
// This has admin rights, so be careful with how you use it
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create Supabase client with anonymous key for public operations
const supabaseAnon = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);

module.exports = { supabaseAdmin, supabaseAnon };
