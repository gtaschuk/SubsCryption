import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PlanRegistry.sol";

contract MyContractTest {
    function testDoSomething() {
        MyContract myContract = MyContract(DeployedAddresses.MyContract());
        bool success = myContract.doSomething(arg1);
        Assert.isTrue(success, "failed to do something");
        uint resultValue = myContract.getSomethingElse();
        Assert.equal(resultValue, 3, "there should be exactly 3 things at this stage");
    }
}