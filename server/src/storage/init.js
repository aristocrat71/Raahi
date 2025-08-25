const { supabaseAdmin } = require('../config/supabase');

async function initializeStorage() {
  try {
    // Check if the bucket exists
    const { data: buckets, error: getBucketsError } = await supabaseAdmin
      .storage
      .listBuckets();
      
    if (getBucketsError) throw getBucketsError;
    
    // Get the bucket name from env
    const bucketName = process.env.SUPABASE_BUCKET || 'images';
    
    // Check if our bucket already exists
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true, // Make the bucket public
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'application/pdf'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createBucketError) throw createBucketError;
      
      console.log(`Created storage bucket: ${bucketName}`);
    } else {
      console.log(`Storage bucket ${bucketName} already exists`);
    }
    
    // Make sure the bucket is public
    const { error: updateBucketError } = await supabaseAdmin.storage.updateBucket(bucketName, {
      public: true
    });
    
    if (updateBucketError) throw updateBucketError;
    
    console.log(`Storage bucket ${bucketName} configured successfully`);
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
}

module.exports = { initializeStorage };
