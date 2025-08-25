const { supabaseAdmin } = require('../config/supabase');

// TripItem model for database operations
class TripItem {
  // Create a new trip item
  static async create(tripItemData) {
    const { data, error } = await supabaseAdmin
      .from('trip_items')
      .insert(tripItemData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all items for a trip
  static async getAllByTrip(tripId) {
    const { data, error } = await supabaseAdmin
      .from('trip_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Get a specific trip item
  static async getById(id) {
    const { data, error } = await supabaseAdmin
      .from('trip_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Update a trip item
  static async update(id, tripId, updateData) {
    const { data, error } = await supabaseAdmin
      .from('trip_items')
      .update(updateData)
      .eq('id', id)
      .eq('trip_id', tripId)  // Additional security check
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete a trip item
  static async delete(id, tripId) {
    const { error } = await supabaseAdmin
      .from('trip_items')
      .delete()
      .eq('id', id)
      .eq('trip_id', tripId);  // Additional security check

    if (error) throw error;
    return true;
  }

  // Bulk create trip items
  static async bulkCreate(tripItems) {
    const { data, error } = await supabaseAdmin
      .from('trip_items')
      .insert(tripItems)
      .select();

    if (error) throw error;
    return data;
  }

  // Get items by type for a trip
  static async getByType(tripId, type) {
    const { data, error } = await supabaseAdmin
      .from('trip_items')
      .select('*')
      .eq('trip_id', tripId)
      .eq('type', type)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  }
}

module.exports = TripItem;
