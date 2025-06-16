import { ethers } from 'ethers';

export const IWRAPPEDVARA_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 value) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)',
  'function transferFrom(address from, address to, uint256 value) returns (bool)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

export const IWRAPPEDVARA_INTERFACE = new ethers.Interface(IWRAPPEDVARA_ABI);

/**
 * Interface for IWrappedVara contract methods
 * Standard ERC20 token interface for wrapped VARA tokens
 */
export interface IWrappedVaraContract {
  /**
   * Returns the amount which spender is still allowed to withdraw from owner
   * @param owner - The address of the account owning tokens
   * @param spender - The address of the account able to transfer the tokens
   * @returns Promise resolving to the remaining number of tokens allowed to spent
   */
  allowance(owner: string, spender: string): Promise<bigint>;

  /**
   * Gets the balance of the specified address
   * @param account - The address to query the balance of
   * @returns Promise resolving to the amount owned by the passed address
   */
  balanceOf(account: string): Promise<bigint>;

  /**
   * Returns the number of decimals used to get its user representation
   * @returns Promise resolving to the number of decimals
   */
  decimals(): Promise<bigint>;

  /**
   * Returns the name of the token
   * @returns Promise resolving to the token name
   */
  name(): Promise<string>;

  /**
   * Returns the symbol of the token
   * @returns Promise resolving to the token symbol
   */
  symbol(): Promise<string>;

  /**
   * Returns the total token supply
   * @returns Promise resolving to the total amount of tokens
   */
  totalSupply(): Promise<bigint>;
}
