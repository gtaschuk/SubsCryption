const Plan = artifacts.require("./Plan.sol");


contract('Plan Contract', accounts => {

  console.log(accounts);
  // Will show ["0x1c25cc6a9f326ac277ce6879b03c4fd0596e10eb", "0x991b2246c8ed92a63ae64c9b910902f55350cd13", "0x258a69adcfb68ad70182bb351c7fa0b0e4b4b4cd"]

  // Your unit tests come here
  it("should start the Plan Contract and .. ", function() {
    var instance;

    var subscriptionAge = 100;
    // You *need to return* the whole Promise chain

    return Plan.deployed()
        .then(_instance => {
            instance = _instance;
            return instance.getCost.call( subscriptionAge, { from: accounts[0] });
        })
        .then(cost => {
            assert.equal(cost, 10000, "cost isnt equal to 10000");
            return instance.doSomething(arg1, { from: accounts[0] });
        })
        .then(txInfo => {
            return instance.getSomethingElse.call();
        })
        .then(resultValue => {
            assert.equal(resultValue.toString(10), "3", "there should be exactly 3 things at this stage");
            // Do not return anything on the last callback or it will believe there is an error.
        });
    });

})