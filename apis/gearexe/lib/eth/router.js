import { generateCodeHash } from '@gear-js/api';
import { BaseContract, ethers } from 'ethers';
import { loadKZG } from '../node_modules/kzg-wasm/dist/browser/index.js';
import assert from 'node:assert';

var CodeState;
(function (CodeState) {
    CodeState["Unknown"] = "Unknown";
    CodeState["ValidationRequested"] = "ValidationRequested";
    CodeState["Validated"] = "Validated";
})(CodeState || (CodeState = {}));
const abi = [
    'function genesisBlockHash() external view returns (bytes32)',
    'function genesisTimestamp() external view returns (uint48)',
    'function latestCommittedBlockHash() external view returns (bytes32)',
    'function mirrorImpl() external view returns (address)',
    'function mirrorProxyImpl() external view returns (address)',
    'function wrappedVara() external view returns (address)',
    'function codeState(bytes32 codeId) external view returns (uint8)',
    'function programCodeId(address program) external view returns (bytes32)',
    'function programsCodeIds(address[] calldata programsIds) external view returns (bytes32[] memory)',
    'function programsCount() external view returns (uint256)',
    'function requestCodeValidation(bytes32 codeId, bytes32 blobTxHash)',
    'function createProgram(bytes32 codeId, bytes32 salt) external returns (address)',
    'event ProgramCreated(address actorId, bytes32 indexed codeId)',
    'event CodeGotValidated(bytes32 codeId, bool indexed valid)',
    'event CodeValidationRequested(bytes32 codeId, bytes32 blobTxHash)',
    'event BlockCommitted(bytes32 hash)',
];
class RouterContract extends BaseContract {
    _wallet;
    constructor(address, abi, wallet) {
        super(address, abi, wallet);
        this._wallet = wallet;
    }
    async codeState(codeId) {
        switch (await this.getFunction('codeState').staticCall(codeId)) {
            case 0n: {
                return CodeState.Unknown;
            }
            case 1n: {
                return CodeState.ValidationRequested;
            }
            case 2n: {
                return CodeState.Validated;
            }
            default: {
                throw new Error('Invalid code state');
            }
        }
    }
    createBlob(code) {
        const blob = prepareBlob(code);
        return ethers.hexlify(blob);
    }
    async requestCodeValidationNoBlob(codeId, txHash) {
        const res = await this.getFunction('requestCodeValidation').send(codeId, txHash);
        const validationPromise = new Promise((resolve, reject) => this.on('CodeGotValidated', (_codeId, valid) => {
            if (_codeId == codeId) {
                if (valid) {
                    resolve(true);
                }
                else {
                    reject(new Error('Code validation failed'));
                }
            }
        }));
        const receipt = await res.wait();
        return {
            receipt,
            waitForCodeGotValidated: () => validationPromise,
        };
    }
    async requestCodeValidation(code) {
        const codeId = generateCodeHash(code);
        const transaction = await this.getFunction('requestCodeValidation').populateTransaction(codeId, '0x0000000000000000000000000000000000000000000000000000000000000000');
        const blob = prepareBlob(code);
        assert(blob.length == 4096 * 32);
        const blobData = ethers.hexlify(blob);
        const kzg = await loadKZG();
        const commitment = kzg.blobToKZGCommitment(blobData);
        const proof = kzg.computeBlobKZGProof(blobData, commitment);
        const tx = {
            type: 3,
            data: transaction.data,
            to: transaction.to,
            gasLimit: 5000000n,
            maxFeePerBlobGas: 400_000_000_000,
            blobs: [
                {
                    data: blobData,
                    commitment: commitment,
                    proof: proof,
                },
            ],
        };
        const txResponse = await this._wallet.sendTransaction(tx);
        const receipt = await txResponse.wait();
        return {
            codeId,
            receipt,
            waitForCodeGotValidated: () => new Promise((resolve, reject) => this.on('CodeGotValidated', (_codeId, valid) => {
                if (_codeId == codeId) {
                    if (valid) {
                        resolve(true);
                    }
                    else {
                        reject(new Error('Code validation failed'));
                    }
                }
            })),
        };
    }
    async createProgram(codeId, salt) {
        const _salt = salt || ethers.hexlify(ethers.randomBytes(32));
        const response = await this.getFunction('createProgram').send(codeId, _salt);
        const receipt = await response.wait();
        const event = receipt.logs.find((log) => 'fragment' in log && log.fragment.name == 'ProgramCreated');
        return {
            blockNumber: receipt.blockNumber,
            id: event.args[0].toLowerCase(),
        };
    }
}
function getRouterContract(id, provider) {
    return RouterContract.from(id, abi, provider);
}
function prepareBlob(data) {
    // https://docs.rs/alloy/latest/alloy/consensus/struct.SimpleCoder.html#behavior
    const BLOB_SIZE = 131_072;
    const paddedData = new Uint8Array(BLOB_SIZE);
    const dataLength = ethers.toBeArray(data.length);
    const length = new Uint8Array(32);
    length.set(dataLength, 1 + 8 - dataLength.length);
    paddedData.set(length, 0);
    let offset = 32;
    while (data.length > 0) {
        const chunk = data.slice(0, 31);
        paddedData.set(chunk, offset + 1);
        offset += 32;
        data = data.slice(31);
    }
    return paddedData;
}

export { CodeState, RouterContract, getRouterContract };
