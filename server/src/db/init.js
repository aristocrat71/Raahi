const { supabaseAdmin } = require('../config/supabase');

async function initializeDatabase() {
  console.log('Initializing database schema...');
  
  try {
    // 1. Create users table if it doesn't exist
    // Note: Supabase already has an auth.users table, but we'll create our own for application data
    const { error: usersTableError } = await supabaseAdmin.rpc('create_table_if_not_exists', {
      table_name: 'users',
      columns_query: `
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });
    
    if (usersTableError) throw usersTableError;
    console.log('Users table created or already exists');

    // 2. Create trips table
    const { error: tripsTableError } = await supabaseAdmin.rpc('create_table_if_not_exists', {
      table_name: 'trips',
      columns_query: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        location TEXT NOT NULL,
        cover_image TEXT,
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });
    
    if (tripsTableError) throw tripsTableError;
    console.log('Trips table created or already exists');

    // 3. Create trip_items table for activities, accommodations, etc.
    const { error: tripItemsTableError } = await supabaseAdmin.rpc('create_table_if_not_exists', {
      table_name: 'trip_items',
      columns_query: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('activity', 'accommodation', 'transportation', 'note')),
        title TEXT NOT NULL,
        description TEXT,
        location TEXT,
        start_time TIMESTAMP WITH TIME ZONE,
        end_time TIMESTAMP WITH TIME ZONE,
        cost DECIMAL(10,2),
        currency TEXT,
        reservation_code TEXT,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });
    
    if (tripItemsTableError) throw tripItemsTableError;
    console.log('Trip items table created or already exists');

    // Set up Row Level Security (RLS) policies
    await setupRowLevelSecurity();

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function setupRowLevelSecurity() {
  try {
    // Enable RLS on tables
    await supabaseAdmin.rpc('enable_rls_on_table', { table_name: 'users' });
    await supabaseAdmin.rpc('enable_rls_on_table', { table_name: 'trips' });
    await supabaseAdmin.rpc('enable_rls_on_table', { table_name: 'trip_items' });
    
    // Create policies for users table
    await supabaseAdmin.rpc('create_policy_if_not_exists', {
      table_name: 'users',
      policy_name: 'users_self_access',
      definition: `
        CREATE POLICY users_self_access ON users
        FOR ALL USING (auth.uid() = id)
      `
    });

    // Create policies for trips table
    await supabaseAdmin.rpc('create_policy_if_not_exists', {
      table_name: 'trips',
      policy_name: 'trips_owner_access',
      definition: `
        CREATE POLICY trips_owner_access ON trips
        FOR ALL USING (auth.uid() = user_id)
      `
    });

    await supabaseAdmin.rpc('create_policy_if_not_exists', {
      table_name: 'trips',
      policy_name: 'trips_public_read_access',
      definition: `
        CREATE POLICY trips_public_read_access ON trips
        FOR SELECT USING (is_public = true)
      `
    });

    // Create policies for trip_items table
    await supabaseAdmin.rpc('create_policy_if_not_exists', {
      table_name: 'trip_items',
      policy_name: 'trip_items_owner_access',
      definition: `
        CREATE POLICY trip_items_owner_access ON trip_items
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM trips 
            WHERE trips.id = trip_items.trip_id AND trips.user_id = auth.uid()
          )
        )
      `
    });

    console.log('Row Level Security policies set up successfully');
  } catch (error) {
    console.error('Error setting up Row Level Security:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };
