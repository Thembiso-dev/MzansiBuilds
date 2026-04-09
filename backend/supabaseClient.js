/**
 * Supabase Client Configuration
 *
 * Initializes and exports the Supabase client instance
 * used across all backend route handlers and models.
 *
 * @module supabaseClient
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env file');
}

/**
 * Supabase client instance with service role key.
 * Service role bypasses Row Level Security — only use on the backend.
 * Never expose this key to the frontend.
 */
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;