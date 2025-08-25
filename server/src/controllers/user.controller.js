const User = require('../models/User');
const { supabaseAdmin } = require('../config/supabase');

// Get the current user
const getCurrentUser = (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar_url: req.user.avatar_url
      }
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, avatar_url } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar_url) updateData.avatar_url = avatar_url;
    
    const updatedUser = await User.update(req.user.id, updateData);
    
    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

module.exports = {
  getCurrentUser,
  updateProfile
};
