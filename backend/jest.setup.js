/**
 * Jest Setup File
 * 
 * Loads environment variables from .env before any tests run.
 * This ensures all modules that require Supabase credentials
 * can initialise correctly during testing.
 */

require('dotenv').config();