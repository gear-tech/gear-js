// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Mirror} from "../src/Mirror.sol";
import {Gear} from "../src/libraries/Gear.sol";
import {Router} from "../src/Router.sol";
import {Script, console} from "forge-std/Script.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {WrappedVara} from "../src/WrappedVara.sol";

import {Middleware} from "../src/Middleware.sol";
import {IMiddleware} from "../src/IMiddleware.sol";

contract DeploymentScript is Script {
    WrappedVara public wrappedVara;
    Router public router;
    Mirror public mirror;
    Middleware public middleware;

    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address[] memory validatorsArray = vm.envAddress("ROUTER_VALIDATORS_LIST", ",");
        uint256 aggregatedPublicKeyX = vm.envUint("ROUTER_AGGREGATED_PUBLIC_KEY_X");
        uint256 aggregatedPublicKeyY = vm.envUint("ROUTER_AGGREGATED_PUBLIC_KEY_Y");
        bytes memory verifiableSecretSharingCommitment = vm.envBytes("ROUTER_VERIFIABLE_SECRET_SHARING_COMMITMENT");
        address deployerAddress = vm.addr(privateKey);

        vm.startBroadcast(privateKey);

        wrappedVara = WrappedVara(
            Upgrades.deployTransparentProxy(
                "WrappedVara.sol", deployerAddress, abi.encodeCall(WrappedVara.initialize, (deployerAddress))
            )
        );

        address mirrorAddress = vm.computeCreateAddress(deployerAddress, vm.getNonce(deployerAddress) + 2);
        address middlewareAddress = vm.computeCreateAddress(deployerAddress, vm.getNonce(deployerAddress) + 3);

        router = Router(
            Upgrades.deployTransparentProxy(
                "Router.sol",
                deployerAddress,
                abi.encodeCall(
                    Router.initialize,
                    (
                        deployerAddress,
                        mirrorAddress,
                        address(wrappedVara),
                        middlewareAddress,
                        1 days,
                        2 hours,
                        5 minutes,
                        Gear.AggregatedPublicKey(aggregatedPublicKeyX, aggregatedPublicKeyY),
                        verifiableSecretSharingCommitment,
                        validatorsArray
                    )
                )
            )
        );
        mirror = new Mirror(address(router));

        wrappedVara.approve(address(router), type(uint256).max);

        if (vm.envExists("SENDER_ADDRESS")) {
            address senderAddress = vm.envAddress("SENDER_ADDRESS");
            wrappedVara.transfer(senderAddress, 500_000 * (10 ** wrappedVara.decimals()));
        }

        vm.roll(vm.getBlockNumber() + 1);
        router.lookupGenesisHash();

        vm.assertEq(router.mirrorImpl(), address(mirror));
        vm.assertNotEq(router.genesisBlockHash(), bytes32(0));

        vm.stopBroadcast();
    }
}
