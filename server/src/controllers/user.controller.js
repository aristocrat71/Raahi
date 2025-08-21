// Get the current user
const getCurrentUser = (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
      }
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
};

module.exports = {
  getCurrentUser
};
