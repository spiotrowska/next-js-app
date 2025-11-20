#!/usr/bin/env node
/**
 * Conditional Sanity type generation.
 * Runs schema extract + typegen only if Node version is in a supported range:
 *   >=20.19 <22  OR  >=22.12
 * Skips silently (with an info message) otherwise to avoid breaking the build.
 */

function nodeSupported() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  // >=20.19 <22
  const range1 = major === 20 && minor >= 19;
  // >=22.12
  const range2 = major === 22 && minor >= 12;
  return range1 || range2 || major > 22; // future majors assumed OK
}

if (!nodeSupported()) {
  console.log('[sanity-typegen] Skipped: unsupported Node version', process.versions.node);
  process.exit(0);
}

import { execSync } from 'child_process';
try {
  console.log('[sanity-typegen] Running schema extract + typegen...');
  execSync('sanity schema extract --path=./sanity/extract.json', { stdio: 'inherit' });
  execSync('sanity typegen generate', { stdio: 'inherit' });
  console.log('[sanity-typegen] Completed successfully');
} catch (err) {
  console.error('[sanity-typegen] Failed:', err.message);
  // Do not hard fail the build; exit 0 to allow Next.js build to proceed.
  process.exit(0);
}
