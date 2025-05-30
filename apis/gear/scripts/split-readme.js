#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const README_PATH = path.join(__dirname, '../README.md');
const DOCS_DIR = path.join(__dirname, '../docs');

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

function splitReadme() {
  console.log('Splitting README.md into sections...');

  const content = fs.readFileSync(README_PATH, 'utf8');
  const lines = content.split('\n');

  let currentSection = '';
  let currentContent = '';
  let inHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect main sections (# followed by space)
    if (line.match(/^# [A-Z]/)) {
      // Save previous section if exists
      if (currentSection && currentContent.trim()) {
        saveSection(currentSection, currentContent.trim());
      }

      // Start new section
      inHeader = false;
      currentSection = getSectionFileName(line);
      currentContent = line + '\n';
    } else if (line.match(/^---\s*$/) && !inHeader) {
      // End of section marker, save current section
      if (currentSection && currentContent.trim()) {
        saveSection(currentSection, currentContent.trim());
      }
      currentSection = '';
      currentContent = '';
    } else {
      // Add line to current section or header
      if (inHeader) {
        if (line.match(/^# Table of Contents/)) {
          // Save header before table of contents
          if (currentContent.trim()) {
            saveSection('header', currentContent.trim());
          }
          currentSection = 'table-of-contents';
          currentContent = line + '\n';
          inHeader = false;
        } else {
          currentContent += line + '\n';
        }
      } else {
        currentContent += line + '\n';
      }
    }
  }

  // Save last section
  if (currentSection && currentContent.trim()) {
    saveSection(currentSection, currentContent.trim());
  }

  console.log('✓ README.md split successfully!');
}

function getSectionFileName(headerLine) {
  const title = headerLine.replace(/^# /, '').trim();

  const mapping = {
    Description: 'description',
    Installation: 'installation',
    'Getting started': 'getting-started',
    'Payload encoding': 'payload-encoding',
    'Getting metadata': 'getting-metadata',
    'Gear extrinsics': 'extrinsics',
    'Program state': 'program-state',
    Events: 'events',
    Blocks: 'blocks',
    Keyring: 'keyring',
    'Working with BaseGearProgram': 'base-gear-program',
  };

  return (
    mapping[title] ||
    title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  );
}

function saveSection(sectionName, content) {
  const fileName = sectionName.endsWith('.md') ? sectionName : `${sectionName}.md`;
  const filePath = path.join(DOCS_DIR, fileName);

  fs.writeFileSync(filePath, content);
  console.log(`✓ Created ${fileName}`);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    splitReadme();
  } catch (error) {
    console.error('Error splitting README:', error.message);
    process.exit(1);
  }
}

export { splitReadme };
