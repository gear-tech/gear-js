import { BaseContract } from 'ethers';
import { convertEventParams } from '../util/event.js';

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
class WrappedVaraContract extends BaseContract {
    constructor(address, provider) {
        super(address, erc20Abi, provider);
    }
    async approve(address, value) {
        const function_ = this.getFunction('approve');
        const response = await function_.send(address, value);
        const receipt = await response.wait();
        const event = receipt.logs?.find((log) => 'fragment' in log && log.fragment.name == 'Approval');
        return convertEventParams(event);
    }
}
function getWrappedVaraContract(address, provider) {
    return new WrappedVaraContract(address, provider);
}

export { WrappedVaraContract, getWrappedVaraContract };
