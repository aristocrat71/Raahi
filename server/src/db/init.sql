-- Function to create users table if it doesn't exist
CREATE OR REPLACE FUNCTION create_users_table_if_not_exists()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Enable Row Level Security
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  
  -- Create policy
  DROP POLICY IF EXISTS users_policy ON public.users;
  CREATE POLICY users_policy ON public.users 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create trips table if it doesn't exist
CREATE OR REPLACE FUNCTION create_trips_table_if_not_exists()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    num_people INTEGER NOT NULL DEFAULT 1,
    transport TEXT NOT NULL
  );
  
  -- Enable Row Level Security
  ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
  
  -- Owner policy
  DROP POLICY IF EXISTS trips_owner_policy ON public.trips;
  CREATE POLICY trips_owner_policy ON public.trips 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
    
  -- Public read policy
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create trip_items table if it doesn't exist
CREATE OR REPLACE FUNCTION create_trip_items_table_if_not_exists()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.trip_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 1,
    is_packed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Enable Row Level Security
  ALTER TABLE public.trip_items ENABLE ROW LEVEL SECURITY;
  
  -- Create policy - users can only access items for trips they own
  DROP POLICY IF EXISTS trip_items_policy ON public.trip_items;
  CREATE POLICY trip_items_policy ON public.trip_items 
    USING (
      EXISTS (
        SELECT 1 FROM public.trips 
        WHERE trips.id = trip_items.trip_id 
        AND trips.user_id = auth.uid()
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.trips 
        WHERE trips.id = trip_items.trip_id 
        AND trips.user_id = auth.uid()
      )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
