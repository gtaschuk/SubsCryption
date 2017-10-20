pragma solidity ^0.4.13;

import "./PlanI.sol";

contract PlanRegistryI {
    event LogPlanCreated(address plan, address owner);

    /**
     * Creates a new plan.
     */
    function createNewPlan(
        uint startingPrice,
        uint floorPrice,
        uint steepness,
        uint inflectionPoint,
        string planDescription
    ) public returns (PlanI);


}
