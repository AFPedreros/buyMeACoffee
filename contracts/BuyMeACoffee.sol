// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Deployed to Goerli at 0x8E2625b0348151e0124F4F5BA113145f57905aa1

// Import this file to use console.log
import "hardhat/console.sol";

contract BuyMeACoffee {
   
   // Event to emit a memo when is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos received from friends
    Memo[] memos;

    // Address of contract deployer
    address payable owner;

    // Address to withdraw tips
    address payable withdrawAddress;

    // Deploy logic
    constructor() {
        owner = payable (msg.sender);
        withdrawAddress = owner;
    }
    
    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffie buyer
     * @param _message a nice message from the coffee buyer
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "You need eth to buy coffee");

        // Add the memo to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emmit a log event when a new memo is created
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev send the entire balance stored in this contract to the withdraw address
     */
    function withdrawTips() public {
        require(withdrawAddress.send(address(this).balance));
    }

    /**
     * @dev retrieve all the memos received and stored on the blockchain
     */
    function getMemos() public view returns(Memo[] memory){
        return memos;
    }

    /**
     * @dev change the address to withdraw tips
     * @param _withdrawAddress new address to withdraw tips
     */
    function setWithdrawAddress(address payable _withdrawAddress) public {
        require(msg.sender == owner);
        withdrawAddress = _withdrawAddress;
    }
}
