/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
//Ignoring all these rules because this is a standalone script run outside the app
// Script to generate PWA icons from reeltimelogo.png
// Run with: node generate-icons.js

const fs = require('fs');
const path = require('path');

async function generateIcons() {
  try {
    // Try to use sharp if available
    const sharp = require('sharp');
    const sizes = [192, 256, 384, 512];
    const inputFile = path.join(__dirname, 'public', 'reeltimelogo.png');
    
    console.log('Generating PWA icons...');
    
    for (const size of sizes) {
      const outputFile = path.join(__dirname, 'public', `icon-${size}x${size}.png`);
      await sharp(inputFile)
        .resize(size, size)
        .toFile(outputFile);
      console.log(`✓ Generated icon-${size}x${size}.png`);
    }
    
    // Generate apple-touch-icon
    await sharp(inputFile)
      .resize(180, 180)
      .toFile(path.join(__dirname, 'public', 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png');
    
    // Generate favicon
    await sharp(inputFile)
      .resize(32, 32)
      .toFile(path.join(__dirname, 'public', 'favicon.ico'));
    console.log('✓ Generated favicon.ico');
    
    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('❌ Sharp library not found. Installing...');
      console.log('Run: npm install --save-dev sharp');
      console.log('Then run this script again: node generate-icons.js');
    } else {
      console.error('❌ Error generating icons:', error.message);
    }
    process.exit(1);
  }
}

generateIcons();
