-- These SQL functions can be run directly in Supabase SQL editor
-- They help with creating tables and RLS policies if they don't already exist

-- Function to create a table if it doesn't exist
CREATE OR REPLACE FUNCTION create_table_if_not_exists(table_name text, columns_query text)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      %s
    );
  ', table_name, columns_query);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to enable RLS on a table
CREATE OR REPLACE FUNCTION enable_rls_on_table(table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    ALTER TABLE %I ENABLE ROW LEVEL SECURITY;
  ', table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a policy if it doesn't exist
CREATE OR REPLACE FUNCTION create_policy_if_not_exists(table_name text, policy_name text, definition text)
RETURNS void AS $$
DECLARE
  policy_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = table_name
    AND policyname = policy_name
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE definition;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
