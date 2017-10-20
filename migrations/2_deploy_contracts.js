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
  const initialSlope = -1
  const intermediateSlope = -1
  const initialPhase = 1
  const initialIntersection = 10000
  const intermediatePhase = 2
  const intermediateIntersection =  10000
  const floorPrice = 5000
  const planDescription = "This is a test plan...."

  let deployedPlanRegistry

  deployer.deploy(PlanRegistry, {from: admin})
  .then(() =>  PlanRegistry.deployed())
  .then(planRegistryInstance => {
    deployedPlanRegistry = planRegistryInstance

    return Promise.allNamed({
      operator1tx: () => deployedPlanRegistry.createNewPlan(initialSlope
        , intermediateSlope
        , initialPhase
        , initialIntersection
        , intermediatePhase
        , intermediateIntersection
        , floorPrice
        , planDescription
        , plan1Owner
        , { from: admin }),
      operator2tx: () => deployedPlanRegistry.createNewPlan(initialSlope
        , intermediateSlope
        , initialPhase
        , initialIntersection
        , intermediatePhase
        , intermediateIntersection
        , floorPrice
        , planDescription
        , plan2Owner
        , { from: admin }),
    })
  })
};
