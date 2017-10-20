pragma solidity ^0.4.13;

import "./Plan.sol";

contract PlanRegistry {

    event LogPlanCreated(address plan, address owner);

    function createNewPlan(
        int _initialSlope,
        int _intermediateSlope,
        uint _initialPhase,
        uint _initialIntersection,
        uint _intermediatePhase,
        uint _intermediateIntersection,
        uint _floorPrice,
        string _planDescription,
        address owner) public returns (Plan) {
        Plan newPlan = new Plan(_initialSlope,
          _intermediateSlope,
          _initialPhase,
          _initialIntersection,
          _intermediatePhase,
          _intermediateIntersection,
          _floorPrice,
          _planDescription
        );
        newPlan.setOwner(owner);
        LogPlanCreated(address(newPlan), owner);
        return newPlan;
    }
}
