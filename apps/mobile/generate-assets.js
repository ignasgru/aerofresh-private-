const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#3B82F6"/>
  <text x="512" y="600" font-family="Arial, sans-serif" font-size="400" font-weight="bold" fill="white" text-anchor="middle">✈</text>
</svg>
`;

// Create a simple splash screen SVG
const splashSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#3B82F6"/>
  <text x="512" y="400" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle">AeroFresh</text>
  <text x="512" y="600" font-family="Arial, sans-serif" font-size="400" font-weight="bold" fill="white" text-anchor="middle">✈</text>
</svg>
`;

// Create favicon
const faviconSvg = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#3B82F6"/>
  <text x="16" y="22" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">✈</text>
</svg>
`;

// Write the files
fs.writeFileSync(path.join(__dirname, 'assets', 'icon.svg'), iconSvg);
fs.writeFileSync(path.join(__dirname, 'assets', 'splash.svg'), splashSvg);
fs.writeFileSync(path.join(__dirname, 'assets', 'adaptive-icon.svg'), iconSvg);
fs.writeFileSync(path.join(__dirname, 'assets', 'favicon.svg'), faviconSvg);

console.log('✅ Generated placeholder assets for Expo Go');
console.log('📱 You can now run: pnpm start');
console.log('📲 Then scan the QR code with Expo Go app on your phone');
