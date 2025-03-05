/**
 * Script to create basic SVG icons for the project
 * This will generate all the required SVG files
 */

const fs = require('fs');
const path = require('path');

// Ensure the public/img directory exists
const imgDir = path.join(__dirname, 'public', 'img');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Define the SVG icons
const svgIcons = {
  'project-icon-1.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#F7B32B" />
    <text x="50" y="55" font-family="Arial" font-size="20" text-anchor="middle" fill="#fff">PtX</text>
  </svg>`,
  
  'project-icon-2.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect x="10" y="10" width="80" height="80" rx="10" fill="#4CAF50" />
    <text x="50" y="55" font-family="Arial" font-size="20" text-anchor="middle" fill="#fff">CCAC</text>
  </svg>`,
  
  'project-icon-3.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <polygon points="50,10 90,90 10,90" fill="#2196F3" />
    <text x="50" y="65" font-family="Arial" font-size="12" text-anchor="middle" fill="#fff">Descarboniz.ar</text>
  </svg>`,
  
  'project-icon-4.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <polygon points="50,10 85,35 85,75 50,100 15,75 15,35" fill="#9C27B0" />
    <text x="50" y="55" font-family="Arial" font-size="10" text-anchor="middle" fill="#fff">C2G y CEPAL</text>
  </svg>`,
  
  'project-icon-5.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M 10,50 C 10,30 30,10 50,10 C 70,10 90,30 90,50 C 90,70 70,90 50,90 C 30,90 10,70 10,50 Z" fill="#FF5722" />
    <text x="50" y="55" font-family="Arial" font-size="10" text-anchor="middle" fill="#fff">Delta Alliance</text>
  </svg>`,
  
  'webinars-icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect x="10" y="20" width="80" height="60" rx="5" fill="#2196F3" />
    <rect x="20" y="30" width="60" height="35" fill="#fff" />
    <circle cx="50" cy="70" r="5" fill="#fff" />
  </svg>`,
  
  'workshops-icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect x="10" y="40" width="80" height="50" fill="#4CAF50" />
    <polygon points="10,40 50,10 90,40" fill="#4CAF50" />
    <rect x="35" y="60" width="30" height="30" fill="#fff" />
  </svg>`,
  
  'seminars-icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="40" r="20" fill="#F7B32B" />
    <rect x="30" y="60" width="40" height="30" fill="#F7B32B" />
    <polygon points="30,60 50,40 70,60" fill="#F7B32B" />
  </svg>`,
  
  'climate-adaptation.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="80" fill="#E1F5FE" />
    <path d="M 30,100 C 30,60 60,30 100,30 C 140,30 170,60 170,100 C 170,140 140,170 100,170 C 60,170 30,140 30,100 Z" fill="none" stroke="#4CAF50" stroke-width="5" />
    <path d="M 100,30 C 120,30 140,40 150,60" fill="none" stroke="#F7B32B" stroke-width="5" />
    <path d="M 100,170 C 80,170 60,160 50,140" fill="none" stroke="#F7B32B" stroke-width="5" />
    <circle cx="100" cy="100" r="30" fill="#4CAF50" />
    <path d="M 90,100 L 110,100 M 100,90 L 100,110" stroke="#fff" stroke-width="3" />
  </svg>`
};

// Create each SVG file
Object.entries(svgIcons).forEach(([filename, content]) => {
  const filePath = path.join(imgDir, filename);
  fs.writeFileSync(filePath, content);
  console.log(`Created ${filePath}`);
});

console.log('All SVG icons have been created successfully!');
