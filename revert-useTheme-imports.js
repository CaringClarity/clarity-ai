#!/usr/bin/env node

/**
 * Reverts all imports of useTheme from "next-themes"
 * back to "@/components/theme-provider"
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const rootDir = args.find(arg => !arg.startsWith("--")) || ".";

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      results.push(fullPath);
    }
  });
  return results;
}

console.log("🔍 Scanning for useTheme imports from 'next-themes'...");

const allFiles = walk(rootDir);
const filesToUpdate = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, "utf8");

  const pattern = /import\s+\{?\s*useTheme\s*\}?\s+from\s+['"]next-themes['"]/g;
  if (pattern.test(content)) {
    filesToUpdate.push(file);

    if (dryRun) {
      console.log(`[DRY RUN] Would update: ${file}`);
    } else {
      const updated = content.replace(pattern, `import { useTheme } from "@/components/theme-provider"`);
      fs.writeFileSync(file, updated, "utf8");
      console.log(`✅ Updated: ${file}`);
    }
  }
});

console.log("\n📊 Summary:");
console.log(`🔹 Files scanned: ${allFiles.length}`);
console.log(`🔄 Files to update: ${filesToUpdate.length}`);

if (dryRun) {
  console.log("\n💡 This was a dry run. Run without --dry-run to apply changes.");
}
