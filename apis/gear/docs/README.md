# Documentation System

This directory contains the modular documentation system for the Gear-JS API. The main README.md is automatically generated from these individual documentation files.

## Structure

```
docs/
├── README.md                   # This file (documentation about the docs system)
├── header.md                   # Header with logo and badges
├── description.md              # Project description
├── installation.md             # Installation instructions
├── getting-started.md          # Getting started guide
├── payloads-and-metadata.md    # Payloads and metadata handling
├── extrinsics.md               # Gear extrinsics documentation
├── programs-and-state.md       # Working with programs and blockchain state
├── base-gear-program.md        # Base Gear program documentation
├── events.md                   # Events handling
├── blocks.md                   # Block operations
└── keyring.md                  # Keyring operations
```

## Scripts

The following npm scripts are available for managing documentation:

### `npm run docs:build`
Builds the main README.md from all documentation sections in the correct order.

### `npm run docs:split`
Splits the current README.md into individual section files. Useful when you want to start with modular documentation from an existing README.

## Usage

### Editing Documentation

1. Edit the relevant `.md` file in the `docs/` directory
2. Run `npm run docs:build` to regenerate the main README.md
3. Or use `npm run docs:watch` for automatic rebuilding during development

### Adding New Sections

1. Create a new `.md` file in the `docs/` directory
2. Add the filename to the `sections` array in `scripts/build-readme.js`
3. Run `npm run docs:build`

### Section Order

The order of sections in the final README.md is determined by the `sections` array in `scripts/build-readme.js`. Modify this array to change the order.

## File Guidelines

- Each file should start with a level 1 header (`# Title`)
- Use relative links for internal references
- Keep code examples properly formatted with language tags
- Maintain consistent style across all files

## Table of Contents

The table of contents is automatically generated based on the level 1 headers in each section file. You don't need to manually maintain it.

## Benefits

- **Modularity**: Each topic has its own file, making it easier to find and edit specific content
- **Maintainability**: Changes to specific sections don't affect other parts of the documentation
- **Collaboration**: Multiple people can work on different sections simultaneously without conflicts
- **Version Control**: Git history is cleaner with smaller, focused changes
- **Automation**: README.md is always up-to-date and consistent
