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
  const planUser1 = accounts[3]
  const h = 450;
  const w = 15;
  const s = 2592000*4; // seconds in a month
  const b = 200;

  const planDescription = "This is a test plan...."

  let deployedPlan1
  let deployedPlan2
  let deployedPlanRegistry

  deployer.deploy(PlanRegistry, {from: admin})
  .then(() =>  PlanRegistry.deployed())
  .then(planRegistryInstance => {
    deployedPlanRegistry = planRegistryInstance

    return Promise.allNamed({
      plan1tx: () => deployedPlanRegistry.createNewPlan(h
        , w
        , s
        , b
        , "Spotify plan"
        , planDescription
        , plan1Owner
        , { from: admin }),
      plan2tx: () => deployedPlanRegistry.createNewPlan(h
        , w
        , s
        , b
        , "Netflix plan"
        , planDescription
        , plan2Owner
        , { from: admin }),
    })
  })
  .then(
    info => {
      deployedPlan1 = Plan.at(info.plan1tx.logs[0].args.plan)
      deployedPlan2 = Plan.at(info.plan2tx.logs[0].args.plan)

      // NOTE:: use this to to create test subscribers
      // return Promise.allNamed({
      //   addBalance1tx: () => deployedPlan1.addBalance({ from: planUser1, value: 3000000000000 }),
      // }
    }
  )
};
