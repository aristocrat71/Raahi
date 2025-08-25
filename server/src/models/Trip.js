const { supabaseAdmin } = require('../config/supabase');

// Trip model for database operations
class Trip {
  // Create a new trip
  static async create(tripData) {
    const { data, error } = await supabaseAdmin
      .from('trips')
      .insert(tripData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get trip by ID
  static async getById(id, userId = null) {
    let query = supabaseAdmin
      .from('trips')
      .select(`
        *,
        trip_items (*)
      `)
      .eq('id', id);

    // If userId is provided, ensure we only return if the user has access
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return data;
  }

  // Get all trips for a user
  static async getAllByUser(userId) {
    const { data, error } = await supabaseAdmin
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Update trip
  static async update(id, userId, updateData) {
    const { data, error } = await supabaseAdmin
      .from('trips')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)  // Security check
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete trip
  static async delete(id, userId) {
    const { error } = await supabaseAdmin
      .from('trips')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);  // Security check

    if (error) throw error;
    return true;
  }

  // Get public trips - removed since is_public is no longer a field
  static async getPublic(limit = 10) {
    throw new Error('Public trips functionality removed');
  }

  // Search trips
  static async search(query, userId) {
    if (!userId) {
      throw new Error('User ID is required for trip search');
    }
    
    let supabaseQuery = supabaseAdmin
      .from('trips')
      .select('*')
      .or(`source.ilike.%${query}%,destination.ilike.%${query}%,transport.ilike.%${query}%`)
      .eq('user_id', userId);

    const { data, error } = await supabaseQuery.limit(20);

    if (error) throw error;

    if (error) throw error;
    return data;
  }
}

module.exports = Trip;
