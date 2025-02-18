import { BaseContract } from 'ethers';
import { convertEventParams } from '../util/event.js';

const mirrorAbi = [
    'function decoder() external view returns (address)',
    'function router() external view returns (address)',
    'function stateHash() external view returns (bytes32)',
    'function nonce() external view returns (uint256)',
    'function inheritor() external view returns (address)',
    'function sendMessage(bytes calldata payload, uint128 value) external returns (bytes32)',
    'function sendReply(bytes32 repliedTo, bytes calldata payload, uint128 value)',
    'function claimValue(bytes32 claimedId)',
    'function executableBalanceTopUp(uint128 value)',
    'event ValueClaimed(bytes32 claimedId, uint128 value)',
    'event Reply(bytes payload, uint128 value, bytes32 replyTo, bytes4 indexed replyCode)',
    'event Message(bytes32 id, address indexed destination, bytes payload, uint128 value)',
    'event StateChanged(bytes32 stateHash)',
    'event MessageQueueingRequested(bytes32 id, address indexed source, bytes payload, uint128 value)',
    'event ReplyQueueingRequested(bytes32 repliedTo, address indexed source, bytes payload, uint128 value)',
    'event ValueClaimingRequested(bytes32 claimedId, address indexed source)',
    'event ExecutableBalanceTopUpRequested(uint128 value)',
];
function getReplyListener(messageId) {
    let _resolve;
    const promise = new Promise((resolve, reject) => {
        _resolve = resolve;
    });
    const listener = (payload, value, replyTo, replyCode, eventPayload) => {
        if (replyTo.toLowerCase() === messageId.toLowerCase()) {
            _resolve({
                payload,
                value,
                replyCode,
                blockNumber: eventPayload.log.blockNumber,
                txHash: eventPayload.log.transactionHash,
            });
        }
    };
    return { listener, promise };
}
class MirrorContract extends BaseContract {
    constructor(address, wallet) {
        super(address, mirrorAbi, wallet);
    }
    async sendMessage(payload, value) {
        const function_ = this.getFunction('sendMessage');
        const response = await function_.send(payload, value);
        const receipt = await response.wait();
        const event = receipt.logs?.find((log) => 'fragment' in log && log.fragment.name == 'MessageQueueingRequested');
        const message = convertEventParams(event);
        const { listener, promise } = getReplyListener(message.id);
        this.on('Reply', listener);
        return {
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            message: message,
            waitForReply: promise.then((result) => {
                this.off('Reply', listener);
                return result;
            }),
        };
    }
    async sendReply(payload, value) {
        const function_ = this.getFunction('sendReply');
        const response = await function_.send(payload, value);
        const receipt = await response.wait();
        const event = receipt.logs?.find((log) => 'fragment' in log && log.fragment.name == 'ReplyQueueingRequested');
        // TODO: type
        return event;
    }
    async claimValue(claimedId) {
        const function_ = this.getFunction('claimValue');
        const response = await function_.send(claimedId);
        const receipt = await response.wait();
        const event = receipt.logs?.find((log) => 'fragment' in log && log.fragment.name == 'ValueClaimingRequested');
        return convertEventParams(event);
    }
    async executableBalanceTopUp(value) {
        const function_ = this.getFunction('executableBalanceTopUp');
        const response = await function_.send(value);
        const receipt = await response.wait();
        const event = receipt.logs?.find((log) => 'fragment' in log && log.fragment.name == 'ExecutableBalanceTopUpRequested');
        return convertEventParams(event);
        // TODO: return waitForResult fn
    }
}
function getMirrorContract(id, provider) {
    return new MirrorContract(id, provider);
}

export { MirrorContract, getMirrorContract };
