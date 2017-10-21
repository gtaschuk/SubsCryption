pragma solidity ^0.4.13;

import './Owned.sol';


contract Plan is Owned {

    int public h;
    int public w;
    int public s;
    int public b;
    int fixedPoint = 1000;
    int scale = 100000000;
    uint secondsInMonth = 30 days;
    uint weiInFinney = 1 finney;

    string public name;
    string public planDescription;

    uint public upfrontPayments;

    address[] public subscribers;

    mapping (address => SubscriberInfo) public subscribersInfo;

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

    event PlanCreatedLog(
        int _h,
        int _w,
        int _s,
        int _b,
        string _planName,
        string _planDescription);
    event getCostLog(uint subscriptionAge, uint cost);
    event addBalanceLog(uint addedBalance, uint unwithdrawn, uint startTime);
    event payUpfrontLog(
        uint balance,
        uint unwithdrawn,
        uint payUpfrontExpirationTime,
        uint upfrontPayments,
        uint timeSpan,
        uint prepayAmount
    );
    event isContinuousModeLog(address subscriber, bool isContinuous);
    event calculateAreaLog(uint startTime, uint endTime, uint area);
    event getEndTimeLog(uint startTime, uint balance, uint endTime);
    event calculateExpirationLog(address subscriber, uint expirationTime);
    event isActiveLog(address subscriber, uint targetTime, bool isIndeed);
    event getBalanceLog(address subscriber, uint balance);
    event getPrepayAmountLog(uint prepayAmount, uint timeSpan, uint amount);
    event calculatePlanBalanceLog(uint BalanceOftheServiceProvider);
    event withdrawFundsForSubscriberLog(address subscriber,uint unwithdrawn, uint withdrawable);
    event withdrawPrePaidBalanceForServiceProviderLog(uint amount);
    event withdrawBalanceForSubscriberLog(address subscriber, uint balance, uint unwithdrawn, uint amount);

    function Plan(
        int _h,
        int _w,
        int _s,
        int _b,
        string _planName,
        string _planDescription) public
    {
        require(_h > 0);
        require(_w > 0);
        require(_s > 0);
        require(_b > 0);

        h = _h;
        w = _w;
        s = _s;
        b = _b;
        planDescription = _planDescription;
        name = _planName;

        PlanCreatedLog(
            h,
            w,
            s,
            b,
            name,
            planDescription
        );
    }

    function getCost(uint subscriptionAge) constant public returns(uint cost) {
        int x = int(subscriptionAge);
        int xs = x - s;
        int n = (h * w * xs) / scale;

        int absxs = xs;
        if (xs < 0) {
            absxs = xs * -1;
        }

        int p = w * absxs;
        int d = 1 + (p / scale);

        int div = (n * fixedPoint) / d;

        int result = (fixedPoint * h) - div + (fixedPoint * b);

        uint finneyResult = uint(result / fixedPoint);

        uint weiResult = finneyResult * weiInFinney;

        return weiResult;
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

        addBalanceLog(info.balance, info.unwithdrawn, info.startingTime);
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
        }
        else if (isContinuousMode(msg.sender)) {
            prepayAmount = getPrepayAmount(block.timestamp, timeSpan);
            require(prepayAmount <= msg.value);
            change =  msg.value - prepayAmount;
            info.balance -= calculateArea(info.startingTime, block.timestamp) + change;
            info.unwithdrawn += change;
            info.payUpfrontExpirationTime = block.timestamp + timeSpan;
            upfrontPayments += prepayAmount;
        }
        else{
            // otherwise it's in prepayment mode
            prepayAmount = getPrepayAmount(info.payUpfrontExpirationTime, timeSpan);
            require(prepayAmount <= msg.value);
            change =  msg.value - prepayAmount;
            info.balance += change;
            info.unwithdrawn += change;
            info.payUpfrontExpirationTime += timeSpan;
            upfrontPayments += prepayAmount;
        }

        payUpfrontLog(
            info.balance,
            info.unwithdrawn,
            info.payUpfrontExpirationTime,
            upfrontPayments,
            timeSpan,
            prepayAmount
        );
    }

    function isContinuousMode(address subscriber) constant public returns(bool isContinuous) {
        if (!isActive(subscriber, block.timestamp)) {
            isContinuous = false;
        }
        else{
            SubscriberInfo storage info  = subscribersInfo[subscriber];
            isContinuous = info.payUpfrontExpirationTime < block.timestamp;
        }
    }

    function calculateArea(uint start, uint end) constant public returns(uint) {
        uint diff = integral(int(end)) - integral(int(start));
        uint weiDiff = diff * weiInFinney;
        return weiDiff / secondsInMonth;
    }

    function abs(int x) constant private returns(int) {
        if (x < 0) {
            return x * -1;
        } else {
            return x;
        }
    }

    function integral(int x) public constant returns(uint){
        int xs = abs(x - s);
        int a = xs + s;
        int c = (w * a) / scale;
        int sw = (s * w) / scale;
        int d = abs(c - sw + 1);
        int e = (h * log(d * 1000000)) / 1000000;
        int f = (e * scale) / w;
        int g = h * abs(x - s);
        int i = x * (h + b);
        return uint(f - g + i);
    }

    function log(int x) constant returns(int) {
        x = x;
        int l = 0;
        while (x >= 1500000) {
            l = l + 405465;
            x = (x * 2) / 3;
        }
        x = x - 1000000;
        int y = x;
        int i = 1;
        while(i < 10) {
            l = l + (y / i);
            i = i + 1;
            y = (y * x) / 1000000;
            l = l - (y / i);
            i = i + 1;
            y = (y * x) / 1000000;
        }
        return l;
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
        SubscriberInfo storage info = subscribersInfo[subscriber];
        if (targetTime < info.payUpfrontExpirationTime) {
            return true;
        }
        uint startTime = max(info.payUpfrontExpirationTime, info.startingTime);
        require(targetTime > startTime);
        uint cost = calculateArea(startTime, targetTime);
        if (info.balance > cost) {
            return true;
        }

        return false;
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
        withdrawFundsForSubscriberLog(subscriber, info.unwithdrawn, withdrawable);
    }

    /*
     * Withdraw the pre paid balances in the contract
     */
    function withdrawPrePaidBalance() fromOwner public {
        require(upfrontPayments > 0);
        uint amount = upfrontPayments;
        upfrontPayments = 0;
        _owner.transfer(amount);
        withdrawPrePaidBalanceForServiceProviderLog(amount);
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

        withdrawBalanceForSubscriberLog(msg.sender, info.balance, info.unwithdrawn, amount);
    }

    function getSubscribersCount() public constant
    returns(uint amount)
    {
        return subscribers.length;
    }
}
