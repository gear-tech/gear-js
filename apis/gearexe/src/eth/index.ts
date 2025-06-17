/**
 * @module eth
 * 
 * This module provides Ethereum-compatible interfaces for interacting with
 * the Gear.Exe network. It includes classes and utilities for working with:
 * 
 * - Mirror contracts: for sending messages and managing program execution
 * - Router contracts: for program creation and code validation
 * - WrappedVara tokens: for the ERC20 representation of VARA tokens
 */

export * from './mirror.js';
export * from './router.js';
export * from './wrappedVara.js';
export * from './tx-manager.js';
export * from './interfaces/index.js';
