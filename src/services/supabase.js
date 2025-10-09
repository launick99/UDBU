import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwxfavsaimbpfbnlvnqw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3eGZhdnNhaW1icGZibmx2bnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTY1NjcsImV4cCI6MjA3NDEzMjU2N30.-PQvTcGoB13nPZ2YcM32naKoTeljxM-Y6kOIZRm9w0E';

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase