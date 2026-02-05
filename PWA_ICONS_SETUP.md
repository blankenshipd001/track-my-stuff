# PWA Icons Setup

Your PWA needs the following icon sizes in the `/public` directory:

- `icon-192x192.png` (192x192 pixels)
- `icon-256x256.png` (256x256 pixels)
- `icon-384x384.png` (384x384 pixels)
- `icon-512x512.png` (512x512 pixels)

## Quick Icon Generation

You can use the existing `monkey.png` as your base logo. Here are some options to generate the required sizes:

### Option 1: Using an online tool
1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload your `/public/monkey.png`
3. Download the generated icons
4. Place them in `/public` directory

### Option 2: Using ImageMagick (command line)
```bash
# Install ImageMagick if needed: brew install imagemagick
cd public
convert monkey.png -resize 192x192 icon-192x192.png
convert monkey.png -resize 256x256 icon-256x256.png
convert monkey.png -resize 384x384 icon-384x384.png
convert monkey.png -resize 512x512 icon-512x512.png
```

### Option 3: Using Node.js sharp library
```bash
npm install sharp
node -e "const sharp = require('sharp'); ['192', '256', '384', '512'].forEach(size => { sharp('public/monkey.png').resize(parseInt(size), parseInt(size)).toFile(\`public/icon-\${size}x\${size}.png\`); });"
```

## Apple Touch Icon
Also create an `apple-touch-icon.png` (180x180 pixels) for iOS devices:
```bash
convert monkey.png -resize 180x180 apple-touch-icon.png
```

## Favicon
Create a `favicon.ico` (32x32 pixels):
```bash
convert monkey.png -resize 32x32 favicon.ico
```
