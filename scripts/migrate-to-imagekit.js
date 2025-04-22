/**
 * ImageKit Migration Script
 * 
 * This script helps migrate all Next.js Image components to our OptimizedImage component.
 * It can be run with Node.js to scan through the project files and replace imports and usages.
 * 
 * Usage:
 *   node scripts/migrate-to-imagekit.js
 * 
 * Note: This script doesn't modify files, it just outputs what needs to be changed.
 * You should carefully review each suggested change before implementing it.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Configuration
const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'src/components');
const pagesDir = path.join(rootDir, 'src/app');
const nextImageImportRegex = /import\s+(?:{\s*)?Image(?:\s*})?\s+from\s+['"]next\/image['"]/;
const imageTagRegex = /<Image\s+([^>]*)>/g;
const fileExtensions = ['.tsx', '.jsx', '.ts', '.js'];

// Files to exclude (keep using Next Image)
const excludeFiles = [
  'OptimizedImage.tsx',
  'imagekit.tsx'
];

async function scanDirectory(dirPath) {
  let results = [];
  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (excludeFiles.includes(entry.name)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      const subResults = await scanDirectory(fullPath);
      results = [...results, ...subResults];
    } else if (fileExtensions.includes(path.extname(entry.name))) {
      const fileStats = await stat(fullPath);
      if (fileStats.isFile()) {
        const content = await readFile(fullPath, 'utf8');
        if (nextImageImportRegex.test(content)) {
          results.push({
            file: fullPath,
            hasNextImage: true,
            content
          });
        }
      }
    }
  }
  
  return results;
}

function suggestChanges(file) {
  const content = file.content;
  const relativePath = path.relative(rootDir, file.file);
  
  console.log(`\n\n====================================================`);
  console.log(`File: ${relativePath}`);
  console.log(`====================================================`);
  
  // 1. Suggest import change
  console.log('\n1. Replace Next.js Image import with OptimizedImage:');
  console.log('- import Image from "next/image";');
  console.log('+ import OptimizedImage from "@/components/OptimizedImage";');
  
  // 2. Find Image tags and suggest replacements
  console.log('\n2. Replace Image component usages:');
  
  let match;
  while ((match = imageTagRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const attrs = match[1];
    
    // Look for line with this tag to get indentation
    const lines = content.split('\n');
    const lineWithTag = lines.findIndex(line => line.includes(fullTag));
    let indentation = '';
    
    if (lineWithTag >= 0) {
      indentation = lines[lineWithTag].match(/^\s*/)[0];
    }
    
    console.log('\nOriginal:');
    console.log(`${indentation}${fullTag}`);
    console.log('Replacement:');
    console.log(`${indentation}<OptimizedImage ${attrs}>`);
  }
}

async function main() {
  console.log('Scanning project for Next.js Image components...');
  
  // Scan components directory
  const componentFiles = await scanDirectory(componentsDir);
  console.log(`Found ${componentFiles.length} component files using Next.js Image`);
  
  // Scan pages directory
  const pageFiles = await scanDirectory(pagesDir);
  console.log(`Found ${pageFiles.length} page files using Next.js Image`);
  
  const allFiles = [...componentFiles, ...pageFiles];
  
  // Generate migration suggestions
  console.log('\n\n====================================================');
  console.log('MIGRATION SUGGESTIONS');
  console.log('====================================================');
  
  allFiles.forEach(file => suggestChanges(file));
  
  console.log('\n\n====================================================');
  console.log('MIGRATION SUMMARY');
  console.log('====================================================');
  console.log(`Total files to migrate: ${allFiles.length}`);
  console.log('\nMigration steps for each file:');
  console.log('1. Replace the import statement with: import OptimizedImage from "@/components/OptimizedImage";');
  console.log('2. Replace all <Image ...> tags with <OptimizedImage ...>');
  console.log('3. Test thoroughly after each file migration');
  console.log('\nNote: For files that need special handling (like background images or specific transformations),');
  console.log('you may need to add additional props such as objectFit, transformations, etc.');
}

main().catch(err => {
  console.error('Migration script error:', err);
  process.exit(1);
}); 