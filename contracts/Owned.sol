pragma solidity ^0.4.13;

import './interfaces/OwnedI.sol';


contract Owned is OwnedI {
    address _owner;

    modifier fromOwner() {
      require(msg.sender == _owner);
      _;
    }

    function Owned() {
      _owner = msg.sender;
    }

    /**
     * Sets the new owner for this contract.
     *   - only the current owner can call this function
     *   - only a new address can be accepted
     *   - only a non-0 address can be accepted
     * @param newOwner The new owner of the contract
     * @return Whether the action was successful.
     * Emits LogOwnerSet.
     */
    function setOwner(address newOwner) fromOwner returns(bool success) {
      require(newOwner != 0);
      require(newOwner != _owner);
      address prev = _owner;
      _owner = newOwner;
      LogOwnerSet(prev, newOwner);
      return true;
    }

    /**
     * @return The owner of this contract.
     */
    function getOwner() constant returns(address owner) {
      return _owner;
    }

    /*
     * You need to create:
     *
     * - a contract named `Owned` that:
     *     - is a `OwnedI`.
     *     - has a modifier named `fromOwner` that rolls back the transaction if the
     * transaction sender is not the owner.
     *     - has a constructor that takes no parameter.
     */
}
