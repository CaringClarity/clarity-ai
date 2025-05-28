#!/usr/bin/env node

/**
 * Script to fix useTheme imports across the codebase
 * 
 * Searches all `.ts` and `.tsx` files and replaces imports from './theme-provider'
 * to use 'next-themes' instead.
 */

const fs = require('fs');
const path = require('path');

// Get CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const rootDir = args.find(arg => !arg.startsWith('--')) || '.';

// Recursively walk through all files in the directory
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

console.log('🔍 Scanning for useTheme imports...\n');

const allFiles = walk(rootDir);
const filesWithUseTheme = allFiles.filter(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes('useTheme');
});

console.log(`📄 Found ${filesWithUseTheme.length} files that reference useTheme.\n`);

let fixedFiles = 0;
let skippedFiles = 0;

filesWithUseTheme.forEach(filePath => {
  if (filePath.endsWith('theme-provider.tsx')) {
    console.log(`⏭️  Skipping theme provider file: ${filePath}`);
    skippedFiles++;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  const importFromThemeProvider = content.includes('import { useTheme } from "./theme-provider"') || 
                                 content.includes("import { useTheme } from './theme-provider'") ||
                                 content.includes('import {useTheme} from "./theme-provider"') ||
                                 content.includes("import {useTheme} from './theme-provider'");

  const relativeImport = content.match(/import\s+[\{\s]*useTheme[\s\}]*\s+from\s+['"]\.\.?\/.*theme-provider['"]/);

  if (importFromThemeProvider || relativeImport) {
    console.log(`🔧 Found useTheme import in: ${filePath}`);

    if (dryRun) {
      console.log(`[DRY RUN] Would fix: ${filePath}`);
      fixedFiles++;
    } else {
      let updatedContent;

      if (importFromThemeProvider) {
        updatedContent = content.replace(
          /import\s+[\{\s]*useTheme[\s\}]*\s+from\s+['"]\.\/theme-provider['"]/g,
          'import { useTheme } from "next-themes"'
        );
      } else if (relativeImport) {
        updatedContent = content.replace(
          /import\s+[\{\s]*useTheme[\s\}]*\s+from\s+['"]\.\.?\/.*theme-provider['"]/g,
          'import { useTheme } from "next-themes"'
        );
      }

      if (updatedContent !== content) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
        fixedFiles++;
      } else {
        console.log(`⚠️  No changes needed in: ${filePath}`);
        skippedFiles++;
      }
    }
  } else {
    skippedFiles++;
  }
});

console.log('\n📊 Summary:');
console.log(`🔹 Total files scanned: ${filesWithUseTheme.length}`);
console.log(`✅ Files fixed: ${fixedFiles}`);
console.log(`⏭️  Files skipped: ${skippedFiles}`);

if (dryRun) {
  console.log('\n💡 This was a dry run. No files were modified.');
  console.log('🔁 Run without --dry-run to apply changes.');
}
