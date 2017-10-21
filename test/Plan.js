const Plan = artifacts.require("./Plan.sol");


contract('Plan Contract', accounts => {

  console.log(accounts);
  // Will show ["0x1c25cc6a9f326ac277ce6879b03c4fd0596e10eb", "0x991b2246c8ed92a63ae64c9b910902f55350cd13", "0x258a69adcfb68ad70182bb351c7fa0b0e4b4b4cd"]

  // Your unit tests come here
  it("should start the Plan Contract and .. ", function() {
    var instance;

    var subscriptionAge = 100;
    var shouldBeCost = 1000;
    // You *need to return* the whole Promise chain

    return Plan.deployed()
        .then(_instance => {
            instance = _instance;
            return instance.addBalance.call(100);
        })
        .then(balance => {
            assert.equal(instance.balance, 100, "Balance is not updating properly");
        })
    });

})