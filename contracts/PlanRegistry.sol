pragma solidity ^0.4.13;

import "./Plan.sol";

contract PlanRegistry {

    event LogPlanCreated(address plan, address owner);

    function createNewPlan(
        int _h,
        int _w,
        int _s,
        int _b,
        string _planName,
        string _planDescription,
        address owner) public returns (Plan) {
        Plan newPlan = new Plan(
            _h,
            _w,
            _s,
            _b,
            _planName,
            _planDescription
        );
        newPlan.setOwner(owner);
        LogPlanCreated(address(newPlan), owner);
        return newPlan;
    }
}
