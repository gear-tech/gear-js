import { BaseContract, EventLog, Provider, Signer } from 'ethers';
import { convertEventParams as convertEventParameters } from '../util';

interface ApprovalLog {
  owner: string;
  spender: string;
  value: bigint;
}

const erc20Abi = [
  'function approve(address spender, uint256 value) external returns (bool)',
  'function transferFrom(address from, address to, uint256 value) external returns (bool)',
  'function transfer(address to, uint256 value) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function name() external view returns (string)',
  'function symbol() external view returns (string memory)',
  'function decimals() external view returns (uint8)',

  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

interface IWrappedVaraContract {
  name: () => Promise<string>;
  symbol: () => Promise<string>;
  decimals: () => Promise<number>;
  balanceOf: (account: string) => Promise<number>;
  totalSupply: () => Promise<number>;
  allowance: (owner: string, spender: string) => Promise<number>;
}

export class WrappedVaraContract extends BaseContract {
  constructor(address: string, provider: Provider | Signer) {
    super(address, erc20Abi, provider);
  }

  async approve(address: string, value: bigint) {
    const function_ = this.getFunction('approve');
    const response = await function_.send(address, value);
    const receipt = await response.wait();

    const event = receipt.logs?.find((log) => 'fragment' in log && log.fragment.name == 'Approval') as EventLog;

    return convertEventParameters<ApprovalLog>(event);
  }
}

export function getWrappedVaraContract(
  address: string,
  provider: Provider | Signer,
): WrappedVaraContract & IWrappedVaraContract {
  return new WrappedVaraContract(address, provider) as WrappedVaraContract & IWrappedVaraContract;
}
