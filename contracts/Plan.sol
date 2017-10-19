pragma solidity ^0.4.13;

contract Plan {

    uint public startingPrice;
    uint public floorPrice;
    uint public steepness;
    uint public inflectionPoint;
    string public planDescription;

    uint public serviceProviderFunds;

    address[] public subscribers;

    mapping (address => SubscriberInfo) subscribersInfo;

    struct SubscriberInfo {
        // 0 -> not signed up
        // 1 -> inactive
        // 2 -> active
        // 3 -> banned
        uint status;

        //
        uint balance;

        //
        uint unwithdrawn;

        // The expiration timestamp for a pre paid subscription.
        uint payUpfrontExpirationTime;

        // The starting timestamp for the current subscription.
        uint startingTime;
    }

    /**
     * Suscribe a user to a plan.
     * Set the balance for this user to be the paid amount.
     *
     * - Add to the balance
     */
    function addBalance() public payable{
        SubscriberInfo storage info  = subscribersInfo[msg.sender];
        if(info.status==0){
            info.balance = msg.value;
            info.status = 2;
            info.startingTime = block.timestamp;
            info.unwithdrawn = msg.value;
            subscribers.push(msg.sender);
        }
        else if(isActive(msg.sender,block.timestamp)) {
            info.balance += msg.value;
            info.unwithdrawn +=msg.value;
        }
        else {
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
     *  - You set the startingTime to the currentTime
     *  - You calculate the expirationTime based on the prePayAmount
     *
     * If startingTime is set:
     *  - Calcualte the area from startingTime to currentTime
     *  - Substract this area from the balance
     *  - Calculate the expirationTime based on prePayAmount
     * else:
     *  - You set the startingTime to the currentTime
     *  - You calculate the expirationTime based on the prePayAmount
     *
     * @param timeSpan how long you want to pre pay for
     */
    function payUpfront(uint timeSpan) public payable {
        uint prePayAmount = getPrepayAmount(timeSpan);
        require(prepayAmount <= msg.value);
        uint change =  msg.value - prepayAmount;
        SubscriberInfo storage info  = subscribersInfo[msg.sender];
        if(!isActive(msg.sender, block.timestamp)){
            info.startingTime = block.timestamp;
            info.payUpfrontExpirationTime = info.startingTime + timeSpan;
            info.balance += change;
        }
        else if(info.startingTime != 0){
            info.balance -= calculateArea(info.startingTime, block.timestamp);
            info.expirationTime =  
        }
        
    }
    
    function calculateArea(uint start, uint end) public returns(uint);

    /**
     * Calculate when the balance expires or until when the user
     * has paid.
     * @return the blockNumber when the subscription expires
     */
    function calculateExpiration() public constant returns (uint blockNumber);

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
    ) public constant returns (bool isIndeed);

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
    function getBalance() public constant returns (uint balance);

    /**
     * Get the cost for a prepay time span. Based on your startingTime if active.
     *
     * @param timeSpan how much time you want to prepay for?
     */
    function getPrepayAmount(
        address subscriber,
        uint timeSpan
    ) public constant returns (uint amount);


    /*
     * Calculate the un withdrawn balance in this Plan.
     * This method iterates through all the users
     */
    function calculatePlanBalance() public constant;

    /**
     * Withdraw funds for the plan owner for a subscriber
     * MODIFIDER: onlyOwner
     * These are the funds that have been used for all subscriptions.
     */
    function withdrawFundsForSubscriber(address subscriber) public;

    /*
     * Withdraw the pre paid balances in the contract
     */
    function withdrawPrePaidBalance() public;

    /**
     * Allow a user to withdraw any unused balance.
     * - The amount has to be less than the value returned by getBalance()
     * - Substract amount from balance
     * @param amount the amount to withdraw
     * requires the user to have an unused balance.
     */
    function withdrawBalance(uint amount) public;
}
