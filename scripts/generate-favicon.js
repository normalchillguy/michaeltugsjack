const https = require('https');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const FAVICON_URL = 'https://static-00.iconduck.com/assets.00/smiling-cat-face-with-heart-shaped-eyes-emoji-2048x2048-xgeugukk.png';
const FAVICON_SIZES = [16, 32, 180]; // 16x16, 32x32 for favicon, 180x180 for apple-touch-icon

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Download the image
https.get(FAVICON_URL, (response) => {
  const chunks = [];
  response.on('data', (chunk) => chunks.push(chunk));
  response.on('end', async () => {
    const buffer = Buffer.concat(chunks);
    
    try {
      // Generate different sizes
      for (const size of FAVICON_SIZES) {
        const resized = await sharp(buffer)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toBuffer();

        if (size === 16) {
          fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), resized);
          // Also use this as the main favicon
          fs.writeFileSync(path.join(publicDir, 'favicon.ico'), resized);
        } else if (size === 32) {
          fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), resized);
        } else if (size === 180) {
          fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), resized);
        }
      }
      
      console.log('Favicon files generated successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
    }
  });
}).on('error', (error) => {
  console.error('Error downloading image:', error);
}); 