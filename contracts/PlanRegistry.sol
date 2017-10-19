pragma solidity ^0.4.13;

import "./Plan.sol";

contract PlanRegistry {

    event LogPlanCreated(address plan, address owner);

    function createNewPlan(address owner) public returns (Plan) {
        Plan newPlan = new Plan(owner);
        LogPlanCreated(address(newPlan), owner);
        return newPlan;
    }
}
