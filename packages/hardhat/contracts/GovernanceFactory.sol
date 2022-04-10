// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Governance.sol";

contract GovernanceFactory {
    // string public name;
    // string private contractAddress;


    struct GovernanceStruct {
        // foundation id
        uint256 _goverenceIndex;
        // owner address
        address _owner;
        // contract address created
        address _contract;
        // doa address
        string _doaAddress;
    }
 

    mapping(uint => GovernanceStruct) public allGovernance;
    // Number of Goverences that have been created
    uint256 public numGovernances;


    function createGovernance(string memory content, string memory doaAddress) public {
        Governance governance = new Governance(
            msg.sender,
            content,
            doaAddress
        );
        allGovernance[numGovernances] = (GovernanceStruct(numGovernances, msg.sender, address(governance), doaAddress));
        numGovernances++;
    }

    function getGoverenceDetails(uint _tokenId) public view returns(GovernanceStruct memory) {
        return allGovernance[_tokenId];
    }

}