#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../docs');
const README_PATH = path.join(__dirname, '../README.md');

// Define the order of sections
const sections = [
  'header.md',
  'table-of-contents.md',
  'description.md',
  'installation.md',
  'getting-started.md',
  'payload-encoding.md',
  'extrinsics.md',
  'program-state.md',
  'events.md',
  'blocks.md',
  'keyring.md',
  'base-gear-program.md',
];

function buildReadme() {
  console.log('Building README.md from docs sections...');

  let content = '';

  for (const section of sections) {
    const sectionPath = path.join(DOCS_DIR, section);

    if (fs.existsSync(sectionPath)) {
      const sectionContent = fs.readFileSync(sectionPath, 'utf8');
      content += sectionContent;

      // Add separator between sections (except for header)
      if (section !== 'header.md') {
        content += '\n\n---\n\n';
      } else {
        content += '\n\n';
      }

      console.log(`✓ Added ${section}`);
    } else {
      console.warn(`⚠️  Section ${section} not found, skipping...`);
    }
  }

  // Remove trailing separator
  content = content.replace(/\n\n---\n\n$/, '\n');

  // Write the final README
  fs.writeFileSync(README_PATH, content);
  console.log(`✓ README.md built successfully!`);
}

// Generate table of contents based on existing sections
function generateTableOfContents() {
  const tocItems = [];

  for (const section of sections) {
    if (section === 'header.md' || section === 'table-of-contents.md') continue;

    const sectionPath = path.join(DOCS_DIR, section);
    if (fs.existsSync(sectionPath)) {
      const content = fs.readFileSync(sectionPath, 'utf8');
      const match = content.match(/^# (.+)$/m);
      if (match) {
        const title = match[1];
        const anchor = title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        tocItems.push(`- [${title}](#${anchor})`);
      }
    }
  }

  const tocContent = `# Table of Contents\n${tocItems.join('\n')}`;
  const tocPath = path.join(DOCS_DIR, 'table-of-contents.md');
  fs.writeFileSync(tocPath, tocContent);
  console.log('✓ Table of contents generated');
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    generateTableOfContents();
    buildReadme();
  } catch (error) {
    console.error('Error building README:', error.message);
    process.exit(1);
  }
}

export { buildReadme, generateTableOfContents };
