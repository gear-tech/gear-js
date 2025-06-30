// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface ICounter {
    function createPrg(uint128 _value, bool _encodeReply) external returns (bytes32 messageId);

    function counterDecrement(uint128 _value, bool _encodeReply) external returns (bytes32 messageId);

    function counterIncrement(uint128 _value, bool _encodeReply) external returns (bytes32 messageId);

    function counterGetValue(uint128 _value, bool _encodeReply) external returns (bytes32 messageId);
}

contract CounterAbi is ICounter {
    function createPrg(uint128 _value, bool _encodeReply) external returns (bytes32 messageId) {}

    function counterDecrement(uint128 _value, bool _encodeReply) external returns (bytes32 messageId) {}

    function counterIncrement(uint128 _value, bool _encodeReply) external returns (bytes32 messageId) {}

    function counterGetValue(uint128 _value, bool _encodeReply) external returns (bytes32 messageId) {}
}

interface ICounterCallbacks {
    function replyOn_createPrg(bytes32 messageId) external;

    function replyOn_counterDecrement(bytes32 messageId, uint32 reply) external;

    function replyOn_counterIncrement(bytes32 messageId, uint32 reply) external;

    function replyOn_counterGetValue(bytes32 messageId, uint32 reply) external;

    function onErrorReply(bytes32 messageId, bytes calldata payload, bytes4 replyCode) external;
}

contract CounterCaller is ICounterCallbacks {
    ICounter public immutable gearExeProgram;

    constructor(ICounter _gearExeProgram) {
        gearExeProgram = _gearExeProgram;
    }

    modifier onlyGearExeProgram() {
        require(msg.sender == address(gearExeProgram), "Only Gear.exe program can call this function");
        _;
    }

    function replyOn_createPrg(bytes32 messageId) external onlyGearExeProgram {
        // TODO: implement this
    }

    function replyOn_counterDecrement(bytes32 messageId, uint32 reply) external onlyGearExeProgram {
        // TODO: implement this
    }

    function replyOn_counterIncrement(bytes32 messageId, uint32 reply) external onlyGearExeProgram {
        // TODO: implement this
    }

    function replyOn_counterGetValue(bytes32 messageId, uint32 reply) external onlyGearExeProgram {
        // TODO: implement this
    }

    function onErrorReply(bytes32 messageId, bytes calldata payload, bytes4 replyCode) external onlyGearExeProgram {
        // TODO: implement this
    }
}
