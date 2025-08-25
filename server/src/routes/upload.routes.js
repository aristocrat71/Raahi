const router = require('express').Router();
const { authenticateJWT } = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Authenticate all routes
router.use(authenticateJWT);

// Upload a file to Supabase storage
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user.id;
    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const contentType = file.mimetype;
    
    const { data, error } = await supabaseAdmin
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, file.buffer, {
        contentType,
        cacheControl: '3600'
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(fileName);

    res.status(200).json({
      success: true,
      url: urlData.publicUrl
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

// Delete a file from storage
router.delete('/:path', async (req, res) => {
  try {
    const filePath = req.params.path;
    const userId = req.user.id;
    
    // Security check - only allow users to delete their own files
    if (!filePath.startsWith(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { error } = await supabaseAdmin
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([filePath]);
      
    if (error) {
      throw error;
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

module.exports = router;
