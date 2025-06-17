/**
 * @module abi
 * 
 * This module exports Ethereum ABI definitions for interacting with
 * Gear.Exe smart contracts. It includes interfaces, ABIs, and helper
 * utilities for the core contract components:
 * 
 * - IRouter: Interface for program creation and code validation
 * - IMirror: Interface for sending messages and managing program state
 * - IWrappedVara: Interface for the ERC20 token representation of VARA
 */

export * from './IRouter.js';
export * from './IMirror.js';
export * from './IWrappedVara.js';
