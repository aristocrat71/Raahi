const { supabaseAdmin } = require('../config/supabase');

// User model for database operations
class User {
  // Create a user or update if exists
  static async createOrUpdate(userData) {
    const { id, name, email, avatar } = userData;

    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert({
        id,
        name,
        email,
        avatar_url: avatar
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user by ID
  static async getById(id) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get user by email
  static async getByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Update user
  static async update(id, updateData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = User;
