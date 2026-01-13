// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface ICounter {
    function createPrg(bool _callReply) external payable returns (bytes32 messageId);

    function counterDecrement(bool _callReply) external payable returns (bytes32 messageId);

    function counterIncrement(bool _callReply) external payable returns (bytes32 messageId);

    function counterIncrementWithValue(bool _callReply) external payable returns (bytes32 messageId);

    function counterGetValue(bool _callReply) external payable returns (bytes32 messageId);
}

contract CounterAbi is ICounter {
    function createPrg(bool _callReply) external payable returns (bytes32 messageId) {}

    function counterDecrement(bool _callReply) external payable returns (bytes32 messageId) {}

    function counterIncrement(bool _callReply) external payable returns (bytes32 messageId) {}

    function counterIncrementWithValue(bool _callReply) external payable returns (bytes32 messageId) {}

    function counterGetValue(bool _callReply) external payable returns (bytes32 messageId) {}
}

interface ICounterCallbacks {
    function replyOn_createPrg(bytes32 messageId) external payable;

    function replyOn_counterDecrement(bytes32 messageId, uint32 reply) external payable;

    function replyOn_counterIncrement(bytes32 messageId, uint32 reply) external payable;

    function replyOn_counterIncrementWithValue(bytes32 messageId, uint32 reply) external payable;

    function replyOn_counterGetValue(bytes32 messageId, uint32 reply) external payable;

    function onErrorReply(bytes32 messageId, bytes calldata payload, bytes4 replyCode) external payable;
}

contract CounterCaller is ICounterCallbacks {
    ICounter public immutable VAR_ETH_PROGRAM;

    error UnauthorizedCaller();

    constructor(ICounter _varaEthProgram) {
        VAR_ETH_PROGRAM = _varaEthProgram;
    }

    modifier onlyVaraEthProgram() {
        _onlyVaraEthProgram();
        _;
    }

    function _onlyVaraEthProgram() internal {
        if (msg.sender != address(VAR_ETH_PROGRAM)) {
            revert UnauthorizedCaller();
        }
    }

    function replyOn_createPrg(bytes32 messageId) external payable onlyVaraEthProgram {
        // TODO: implement this
    }

    function replyOn_counterDecrement(bytes32 messageId, uint32 reply) external payable onlyVaraEthProgram {
        // TODO: implement this
    }

    function replyOn_counterIncrement(bytes32 messageId, uint32 reply) external payable onlyVaraEthProgram {
        // TODO: implement this
    }

    function replyOn_counterIncrementWithValue(bytes32 messageId, uint32 reply) external payable onlyVaraEthProgram {
        // TODO: implement this
    }

    function replyOn_counterGetValue(bytes32 messageId, uint32 reply) external payable onlyVaraEthProgram {
        // TODO: implement this
    }

    function onErrorReply(bytes32 messageId, bytes calldata payload, bytes4 replyCode) external payable onlyVaraEthProgram {
        // TODO: implement this
    }
}
