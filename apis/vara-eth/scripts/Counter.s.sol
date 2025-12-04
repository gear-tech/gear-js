import {Script, console} from "forge-std/Script.sol";
import {CounterAbi} from "../contracts/Counter.sol";

contract CounterDeploy is Script {
    uint256 privateKey;
    address router;
    bytes32 codeId;

    function setUp() public {
        privateKey = vm.envUint("CLIENT_KEY_PRIVATE");
        router = vm.envAddress("ROUTER_ADDRESS");
        console.log("Router address:", router);
        codeId = vm.envBytes32("CODE_ID");
    }

    function run() public {
        vm.startBroadcast(privateKey);

        CounterAbi counter = new CounterAbi();

        bytes memory payload = abi.encodeWithSignature("createProgramWithAbiInterface(bytes32,bytes32,address,address)", codeId, bytes32(vm.randomUint()), address(0), address(counter));

        (bool success, bytes memory data) = router.call(payload);

        if (!success) {
            console.log("Failed to create program");
            return;
        }

        address mirror = abi.decode(data, (address));

        console.log("Mirror address:", mirror);

        vm.stopBroadcast();
    }
}
