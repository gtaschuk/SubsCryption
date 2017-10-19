pragma solidity ^0.4.13;

contract Plan {

    address public owner;

    function Plan(address _owner) public {
        owner = _owner;
    }
}
