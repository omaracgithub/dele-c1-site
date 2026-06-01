#!/usr/bin/env node

/**
 * tag-ctas.js
 *
 * Finds all HTML files in the site, locates App Store links,
 * and ensures they have the correct UTM parameters:
 *   pt=126845029
 *   ct=<page-specific value based on directory>
 *   mt=8
 *
 * Usage:
 *   node scripts/tag-ctas.js
 *   node scripts/tag-ctas.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const APP_STORE_BASE = 'https://apps.apple.com/app/id0000000000';
const DRY_RUN = process.argv.includes('--dry-run');

const REQUIRED_PARAMS = {
  pt: '126845029',
  mt: '8',
};

/**
 * Recursively find all HTML files in a directory.
 */
function findHtmlFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Derive a ct (campaign tag) value from the file path.
 * Examples:
 *   /blog/que-es-dele-c1/index.html -> blog-que-es-dele-c1
 *   /en/blog/what-is-dele-c1/index.html -> blog-what-is-dele-c1
 *   /index.html -> homepage
 *   /modelo-examen/index.html -> modelo-examen
 */
function deriveCampaignTag(filePath) {
  const relative = path.relative(SITE_ROOT, filePath);
  const parts = relative.split(path.sep);

  // Remove index.html from the end
  if (parts[parts.length - 1] === 'index.html') {
    parts.pop();
  }

  // Remove 'en' prefix for English pages (the slug is enough)
  const filtered = parts.filter(p => p !== 'en');

  if (filtered.length === 0) return 'homepage';

  // Join remaining parts with hyphens
  return filtered.join('-');
}

/**
 * Process a single App Store URL and ensure it has correct parameters.
 * Returns the corrected URL.
 */
function ensureUtmParams(url, campaignTag) {
  try {
    const urlObj = new URL(url);

    // Set required params
    urlObj.searchParams.set('pt', REQUIRED_PARAMS.pt);
    urlObj.searchParams.set('mt', REQUIRED_PARAMS.mt);

    // Set ct if not already present, or update if it's generic
    if (!urlObj.searchParams.has('ct') || urlObj.searchParams.get('ct') === '') {
      urlObj.searchParams.set('ct', campaignTag);
    }

    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails, construct manually
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}pt=${REQUIRED_PARAMS.pt}&ct=${campaignTag}&mt=${REQUIRED_PARAMS.mt}`;
  }
}

/**
 * Process a single HTML file: find App Store links and ensure UTM params.
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const campaignTag = deriveCampaignTag(filePath);
  let modified = false;
  let linkCount = 0;

  // Match App Store URLs (both with and without existing params)
  const appStoreRegex = /https:\/\/apps\.apple\.com\/app\/id0000000000[^"'\s]*/g;

  const newContent = content.replace(appStoreRegex, (match) => {
    linkCount++;
    const corrected = ensureUtmParams(match, campaignTag);
    if (corrected !== match) {
      modified = true;
    }
    return corrected;
  });

  if (linkCount === 0) return { filePath, linkCount: 0, modified: false };

  if (modified && !DRY_RUN) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }

  return { filePath, linkCount, modified, campaignTag };
}

// Main execution
console.log('🔍 Scanning for HTML files...\n');
const htmlFiles = findHtmlFiles(SITE_ROOT);
console.log(`Found ${htmlFiles.length} HTML files.\n`);

let totalLinks = 0;
let totalModified = 0;

for (const file of htmlFiles) {
  const result = processFile(file);

  if (result.linkCount > 0) {
    const relative = path.relative(SITE_ROOT, result.filePath);
    const status = result.modified ? '✏️  Updated' : '✅ OK';
    console.log(`${status}  ${relative} (${result.linkCount} link${result.linkCount > 1 ? 's' : ''}, ct=${result.campaignTag})`);
    totalLinks += result.linkCount;
    if (result.modified) totalModified++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Files scanned: ${htmlFiles.length}`);
console.log(`   App Store links found: ${totalLinks}`);
console.log(`   Files updated: ${totalModified}`);

if (DRY_RUN) {
  console.log('\n⚠️  Dry run mode — no files were modified.');
}
