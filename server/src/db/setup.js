const { supabaseAdmin } = require('../config/supabase');

async function setupDatabase() {
  try {
    // Create tables if they don't exist
    await createTables();
    console.log('Tables created successfully');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

async function createTables() {
  // Create users table
  const { error: usersError } = await supabaseAdmin.rpc('create_users_table_if_not_exists');
  if (usersError) throw usersError;

  // Create trips table
  const { error: tripsError } = await supabaseAdmin.rpc('create_trips_table_if_not_exists');
  if (tripsError) throw tripsError;
  
  // Create trip items table
  const { error: tripItemsError } = await supabaseAdmin.rpc('create_trip_items_table_if_not_exists');
  if (tripItemsError) throw tripItemsError;
}

module.exports = { setupDatabase };
