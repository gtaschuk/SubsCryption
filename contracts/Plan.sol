pragma solidity ^0.4.13;

import './Owned.sol';


contract Plan is Owned {

    uint public startingPrice;
    uint public floorPrice;
    uint public steepness;
    uint public inflectionPoint;
    string public planDescription;

    uint public upfrontPayments;

    address[] public subscribers;

    mapping (address => SubscriberInfo) subscribersInfo;

    struct SubscriberInfo {
        uint balance;
        uint unwithdrawn;

        // The expiration timestamp for a pre paid subscription.
        uint payUpfrontExpirationTime;

        // The starting timestamp for the current subscription.
        uint startingTime;
    }


    modifier fromSubscriber() {
        SubscriberInfo storage info  = subscribersInfo[msg.sender];
        require(info.startingTime != 0);
        _;
    }


    function getCost(uint subscriptionAge) constant public returns(uint cost) {
      return 100;
    }

    /**
     * Suscribe a user to a plan.
     * Set the balance for this user to be the paid amount.
     *
     * - Add to the balance
     */
    function addBalance() public payable{
        SubscriberInfo storage info  = subscribersInfo[msg.sender];
        if (info.startingTime == 0) {
            info.balance = msg.value;
            info.startingTime = block.timestamp;
            info.unwithdrawn = msg.value;
            subscribers.push(msg.sender);
        } else if (isActive(msg.sender, block.timestamp)) {
            info.balance += msg.value;
            info.unwithdrawn += msg.value;
        } else {
            info.balance = msg.value;
            info.unwithdrawn += msg.value;
            info.startingTime = block.timestamp;
        }
    }

    /**
     * Suscribe a user to a plan.
     * Pre-pay for a certain amount of time.
     *
     * If not active:
     *  - check to make sure msg.value is sufficient
     *  - You set the startingTime to the currentTime
     *  - Expiration time is startingTime plus timeSpan
     *  - Increment upfrontPayments
     *
     * If continuous mode
     *   - check to make sure msg.value is sufficient
     *   - calculate remaining balance
     *   - set expiration time
     *   - Increment upfrontPayments
     * else:
     *   - check to make sure msg.value is sufficient
     *   - if there's excess, add to balance
     *   - Increment upfrontPayments
     *   - add timespan to expiration
     *   - add to unwithdrawn
     *
     * @param timeSpan how long you want to pre pay for
     */
    function payUpfront(uint timeSpan) public payable {
      /*
        */
        uint prepayAmount;
        uint change;
        SubscriberInfo storage info  = subscribersInfo[msg.sender];
        if (!isActive(msg.sender, block.timestamp)) {
            prepayAmount = getPrepayAmount(block.timestamp, timeSpan);
            require(prepayAmount <= msg.value);
            change =  msg.value - prepayAmount;
            info.startingTime = block.timestamp;
            info.payUpfrontExpirationTime = info.startingTime + timeSpan;
            info.balance = change;
            info.unwithdrawn += change;
            upfrontPayments += prepayAmount;
            return;
        }

        if (isContinuousMode(msg.sender)) {
            prepayAmount = getPrepayAmount(block.timestamp, timeSpan);
            require(prepayAmount <= msg.value);
            change =  msg.value - prepayAmount;
            info.balance -= calculateArea(info.startingTime, block.timestamp) + change;
            info.unwithdrawn += change;
            info.payUpfrontExpirationTime = block.timestamp + timeSpan;
            upfrontPayments += prepayAmount;
            return;
        }

        // otherwise it's in prepayment mode
        prepayAmount = getPrepayAmount(info.payUpfrontExpirationTime, timeSpan);
        require(prepayAmount <= msg.value);
        change =  msg.value - prepayAmount;
        info.balance += change;
        info.unwithdrawn += change;
        info.payUpfrontExpirationTime += timeSpan;
        upfrontPayments += prepayAmount;
    }

    function isContinuousMode(address subscriber) constant public returns(bool) {
      if (!isActive(subscriber, block.timestamp)) {
        return false;
      }

      SubscriberInfo storage info  = subscribersInfo[subscriber];
      return info.payUpfrontExpirationTime < block.timestamp;
    }

    function calculateArea(uint start, uint end) public returns(uint);

    // inverse of integral function
    function getEndTime(uint balance, uint startTime)
        constant
        public
        returns(uint endTime)
    {
        return 0;
    }

    /**
     * Calculate when the balance expires or until when the user
     * has paid.
     * @return the blockNumber when the subscription expires
     */
    function calculateExpiration(address subscriber) public constant returns (uint blockNumber) {
        SubscriberInfo storage info  = subscribersInfo[subscriber];
        uint startTime = max(info.payUpfrontExpirationTime, info.startingTime);
        return getEndTime(info.balance, startTime);
    }

    function max(uint a, uint b) private returns (uint) {
        return a > b ? a : b;
    }

    /**
     * Calculates if a user has enough balance to be active or if the
     * user is in an inactive state.
     *
     * Two scenarios:
     *  1: The user doesn't have an expiration time set.
     *     - Calculate the area from startingTime to targetTime
     *     - If balance >= to the area then is active.
     *  2: The user has an expiration time set.
     *     - If the targetTime is less than expirationTime then is active
     *     - Calculate the area from expirationTime to targetTime
     *     - If balance >= to this area then is active
     * @return if a user is active or not
     */
    function isActive(
        address subscriber,
        uint targetTime
    ) public constant returns (bool isIndeed) {
        return calculateExpiration(subscriber) > targetTime;
    }

    /**
     * Get the balance of a user.
     *
     * If expirationTime is set and currentTime < expirationTime
     *  - Return balance
     * If expirationTime is set and currentTime > expirationTime
     *  - Calculate area from expirationTime to currentTime
     *  - Substract the balance from this area
     * If expirationTime is not set
     *  - Calculate area from startingTime to currentTime
     *  - Substract the balance from this area
     *
     *
     * @return the balance of the user
     */
    function getBalance(address subscriber) public constant returns (uint balance) {
        SubscriberInfo storage info  = subscribersInfo[subscriber];
        uint startTime = max(info.payUpfrontExpirationTime, info.startingTime);
        uint used = calculateArea(startTime, block.timestamp);
        if (info.balance > used) {
            return info.balance - used;
        }

        return 0;
    }

    /**
     * Get the cost for a prepay time span. Based on your startingTime if active.
     *
     * @param timeSpan how much time you want to prepay for?
     */
    function getPrepayAmount(
        uint prepayStartTime,
        uint timeSpan
    ) public constant returns (uint amount) {
        return getCost(prepayStartTime + timeSpan) * timeSpan;
    }

    /*
     * Calculate the un withdrawn balance in this Plan.
     * This method iterates through all the users
     */
    function calculatePlanBalance() public constant returns(uint total) {
        for (uint i = 0; i < subscribers.length; ++i) {
            SubscriberInfo storage info  = subscribersInfo[subscribers[i]];
            total += (info.unwithdrawn - getBalance(subscribers[i]));
        }
        return total;
    }

    /**
     * Withdraw funds for the plan owner for a subscriber
     * These are the funds that have been used for all subscriptions.
     */
    function withdrawFundsForSubscriber(address subscriber) fromOwner public {
        SubscriberInfo storage info  = subscribersInfo[subscriber];
        require(info.startingTime > 0);
        require(info.unwithdrawn > 0);
        uint withdrawable = info.unwithdrawn - getBalance(subscriber);
        info.unwithdrawn -= withdrawable;
        _owner.transfer(withdrawable);
    }

    /*
     * Withdraw the pre paid balances in the contract
     */
    function withdrawPrePaidBalance() fromOwner public {
        require(upfrontPayments > 0);
        uint amount = upfrontPayments;
        upfrontPayments = 0;
        _owner.transfer(amount);
    }

    /**
     * Allow a user to withdraw any unused balance.
     * - The amount has to be less than the value returned by getBalance()
     * - Substract amount from balance
     * @param amount the amount to withdraw
     * requires the user to have an unused balance.
     */
    function withdrawBalance(uint amount) fromSubscriber public {
        SubscriberInfo storage info  = subscribersInfo[msg.sender];
        uint remainingBalance = getBalance(msg.sender);
        require(amount <= remainingBalance);
        info.balance -= amount;
        info.unwithdrawn -= amount;
        msg.sender.transfer(amount);
    }
}
