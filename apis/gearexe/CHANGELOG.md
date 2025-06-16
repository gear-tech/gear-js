# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0).

## [Unreleased]

### Added
- **Enhanced Transaction Manager**: Significantly upgraded the `TxManager` class with TypeScript generics support, improved type safety, and comprehensive JSDoc documentation
- **New Interface System**: Added a complete set of TypeScript interfaces for better type safety:
  - `ITxManager` - Core transaction manager interface
  - `TxManagerWithHelpers` - Transaction manager with helper functions
  - Interface definitions for Mirror, Router, and WrappedVara contracts
- **ABI Support**: Added new ABI definitions for Ethereum contracts:
  - `IMirror.ts` - Mirror contract ABI
  - `IWrappedVara.ts` - WrappedVara contract ABI
- **Enhanced Testing Infrastructure**:
  - Reorganized test scripts (moved from root to `scripts/` directory)
  - Added comprehensive environment setup script (`setup-env.sh`)
  - Added Solidity deployment script for router testing

### Changed
- **Improved Contract Classes**: Refactored Ethereum contract interaction classes:
  - Enhanced `Mirror` class with better transaction handling
  - Updated `Router` class with improved type safety
  - Improved `WrappedVara` class with standardized transaction management
- **Updated ABI**: Enhanced `IRouter.ts` - Router contract ABI
- **Build & Release**: Updated GitHub workflow configurations and package dependencies
- **Jest Configuration**: Updated for better test coverage

### Improved
- TypeScript strict typing throughout the codebase
- Added comprehensive JSDoc documentation for public APIs
- Better error handling and type guards
- Standardized transaction lifecycle management across all Ethereum interactions
- Unified, type-safe approach to handling all Ethereum transactions
