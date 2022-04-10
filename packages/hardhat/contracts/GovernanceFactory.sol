// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Governance.sol";

contract GovernanceFactory {
    string public name;
    string private contractAddress;

    struct GovernanceStruct {
        // foundation id
        uint256 _goverenceIndex;
        // owner address
        address _owner;
        // contract address created
        address _contract;
    }
 

    mapping(uint => GovernanceStruct) public allGovernance;
    // Number of Goverences that have been created
    uint256 public numGovernances;


    function createGovernance(string memory name, string memory content) public {
        Governance governance = new Governance(
            name,
            msg.sender,
            content
        );
        allGovernance[numGovernances] = (GovernanceStruct(numGovernances, msg.sender, address(governance)));
        numGovernances++;
    }

    function getGoverenceDetails(uint _tokenId) public view returns(GovernanceStruct memory) {
        return allGovernance[_tokenId];
    }

}