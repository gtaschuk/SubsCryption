var PlanRegistry = artifacts.require("./PlanRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(PlanRegistry);
};
