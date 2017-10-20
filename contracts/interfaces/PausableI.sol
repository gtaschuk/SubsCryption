pragma solidity ^0.4.13;

contract PausableI {
    /**
     * Event emitted when a new paused state has been set.
     * @param sender The account that ran the action.
     * @param newPausedState The new, and current, paused state of the contract.
     */
    event LogPausedSet(address indexed sender, bool indexed newPausedState);

    /**
     * Sets the new paused state for this contract.
     *     It should roll back if the caller is not the current owner of this contract.
     *     It should roll back if the state passed is no different from the current.
     * @param newState The new desired "paused" state of the contract.
     * @return Whether the action was successful.
     * Emits LogPausedSet.
     */
    function setPaused(bool newState) returns(bool success);

    /**
     * @return Whether the contract is indeed paused.
     */
    function isPaused() constant returns(bool isIndeed);

    /*
     * You need to create:
     *
     * - a contract named `Pausable` that:
     *     - is a `OwnedI` and a `PausableI`.
     *     - has a modifier named `whenPaused` that rolls back the transaction if the
     * contract is in the `false` paused state.
     *     - has a modifier named `whenNotPaused` that rolls back the transaction if the
     * contract is in the `true` paused state.
     *     - has a constructor that takes one `bool` parameter, the initial paused state.
     */
}