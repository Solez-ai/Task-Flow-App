
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zbbytevujvxekjssjbdb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiYnl0ZXZ1anZ4ZWtqc3NqYmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwODI1NDksImV4cCI6MjA2MTY1ODU0OX0.7eDbW2IQDv1lVH9lHoFnkUCpcbH6jmCBDAyYAzgjuVM';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined
  }
});
