pragma solidity ^0.4.13;

import './Owned.sol';
import './interfaces/PausableI.sol';


contract Pausable is Owned, PausableI {
    bool paused;

    modifier whenPaused() {
      require(paused);
      _;
    }

    modifier whenNotPaused() {
      require(!paused);
      _;
    }

    function Pausable(bool initialState) {
      paused = initialState;
    }


    /**
     * Sets the new paused state for this contract.
     *   - only the current owner of this contract can call this function.
     *   - only a state different from the current one can be passed.
     * @param newState The new desired "paused" state of the contract.
     * @return Whether the action was successful.
     * Emits LogPausedSet.
     */
    function setPaused(bool newState) fromOwner returns(bool success) {
        paused = newState;
        LogPausedSet(msg.sender, newState);
        return true;
    }

    /**
     * @return Whether the contract is indeed paused.
     */
    function isPaused() constant returns(bool isIndeed) {
      return paused;
    }
}
