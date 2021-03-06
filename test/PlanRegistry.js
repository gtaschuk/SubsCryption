const PlanRegistry = artifacts.require("./PlanRegistry.sol");


contract('PlanRegistry', accounts => {

  console.log(accounts);
  // Will show ["0x1c25cc6a9f326ac277ce6879b03c4fd0596e10eb", "0x991b2246c8ed92a63ae64c9b910902f55350cd13", "0x258a69adcfb68ad70182bb351c7fa0b0e4b4b4cd"]

  // Your unit tests come here
  it("should start the PlanRegistry Contract and .. ", function() {
    var instance;

        var h = 0;
        var w = 0;
        var s = 0;
        var b = 0;
        var planName = "planName";
        var planDescription = "planDescription";
        var owner = accounts[0];
    // You *need to return* the whole Promise chain
    return PlanRegistry.deployed()
        .then(_instance => {
            instance = _instance;
            return instance.createNewPlan.call(
                    h,
                    w,
                    s,
                    b,
                    planName,
                    planDescription,
                    owner,
                    { from: accounts[0] });
                })
        .then(success => {
            assert.isTrue(success, "failed to do this");
        })
    });

});

