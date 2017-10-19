const PlanRegistry = artifacts.require("./PlanRegistry.sol");
const Plan = artifacts.require("./Plan.sol");
const Web3 = require('web3')
const Promise = require("bluebird")
Promise.allNamed = require("../utils/sequentialPromiseNamed.js")

module.exports = (deployer, network, accounts) => {
  deployer.deploy(PlanRegistry);

  const admin = accounts[0]
  const plan1Owner = accounts[1]
  const plan2Owner = accounts[2]

  let deployedPlanRegistry

  deployer.deploy(PlanRegistry, {from: admin})
  .then(() =>  PlanRegistry.deployed())
  .then(planRegistryInstance => {
    deployedPlanRegistry = planRegistryInstance

    return Promise.allNamed({
      operator1tx: () => deployedPlanRegistry.createNewPlan(plan1Owner, { from: admin }),
      operator2tx: () => deployedPlanRegistry.createNewPlan(plan2Owner, { from: admin }),
    })
  })
};
