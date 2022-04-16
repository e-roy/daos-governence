// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IGovernance.sol";

contract Governance is ERC721URIStorage {
    IGovernance governance;

    address public _owner;
    string public _content;
    string public _doaAddress;

    uint256 public _forGovernanceVotes;
    uint256 public _againstGovernanceVotes;

    string public _governanceStatus;

    uint256 public _timeCreated;
    uint256 public _timeGovVoteEnd;
    uint256 public _timeProposalSubmitEnd;
    uint256 public _timeProposalVoteEnd;



    // Create a struct named Proposal containing all relevant information
    struct Proposal {
        // content - the content of the proposal
        string content;
        // doaAddress - the address of the doa that the proposal is for
        string doaAddress;
        // deadline - the UNIX timestamp until which this proposal is active. Proposal can be executed after the deadline has been exceeded.
        uint256 deadline;
        // forProposalVotes - number of yes votes for this proposal
        uint256 forProposalVotes;
        // againstProposalVotes - number of no votes for this proposal
        uint256 againstProposalVotes;
        // forProposalVotes - number of yes votes for this proposal
        uint256 forProposalExecute;
        // againstProposalVotes - number of no votes for this proposal
        uint256 againstProposalExecute;
        // executed - whether or not this proposal has been executed yet. Cannot be executed before the deadline has been exceeded.
        bool executed;
        // voters - a mapping of the NFT tokenIDs to booleans indicating whether that NFT has already been used to cast a vote or not
        mapping(uint256 => bool) voters;
    }

    // Create an enum named Vote containing possible options for a vote
    enum Vote {
        YES,
        NO
    }

    // Create a mapping of ID to Proposal
    mapping(uint256 => Proposal) public proposals;
    // Number of proposals that have been created
    uint256 public numProposals;

    constructor(
        address owner,
        string memory content,
        string memory doaAddress
    ) ERC721("DAO Governance", "DAO") {
        _owner = owner;
        _content = content;
        _doaAddress = doaAddress;
        // yesVotes - number of no votes for this governance
        _forGovernanceVotes = 0;
        // noVotes - number of no votes for this governance
        _againstGovernanceVotes = 0;
        // set the governance status to "Voting"
        _governanceStatus = "Voting";
        // set the timeCreated to the current block timestamp
        _timeCreated = block.timestamp;
    }

 
    // Create a modifier which only allows a function to be
    // called by someone who owns at least 1 NFT
    modifier nftHolderOnly() {
        // require(foundation.balanceOf(msg.sender) > 0, "NOT_A_DAO_MEMBER");
        _;
    }


    function voteOnGovernance(Vote vote)
        external
        nftHolderOnly
    {
        uint256 numVotes = 1;
  
        // require(numVotes > 0, "ALREADY_VOTED");

        if (vote == Vote.YES) {
            _forGovernanceVotes += numVotes;
        } else {
            _againstGovernanceVotes += numVotes;
        }
    }


    // Create a modifier which only allows a function to be
    // called if the given proposal's deadline has not been exceeded yet
    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "DEADLINE_EXCEEDED"
        );
        _;
    }

    // Create a modifier which only allows a function to be
    // called if the given proposals' deadline HAS been exceeded
    // and if the proposal has not yet been executed
    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp,
            "DEADLINE_NOT_EXCEEDED"
        );
        require(
            proposals[proposalIndex].executed == false,
            "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }

    /// @dev createProposal allows a the NFT holder to create a new proposal in the DAO
    /// @param content - the proposal's content
    /// @param doaAddress - the address of doa that the proposal is for
    /// @return Returns the proposal index for the newly created proposal
    function createProposal(string memory content, string memory doaAddress)
        external
        nftHolderOnly
        returns (uint256)
    {
        // require(nftMarketplace.available(_nftTokenId), "NFT_NOT_FOR_SALE");
        Proposal storage proposal = proposals[numProposals];
        proposal.content = content;
        proposal.doaAddress = doaAddress;
        // Set the proposal's voting deadline to be (current time + 5 minutes)
        proposal.deadline = block.timestamp + 5 minutes;

        numProposals++;

        return numProposals - 1;
    }


    /// @dev voteOnProposal allows the NFT holder to cast their vote on an active proposal
    /// @param proposalIndex - the index of the proposal to vote on in the proposals array
    /// @param vote - the type of vote they want to cast
    function voteOnProposal(uint256 proposalIndex, Vote vote)
        external
        nftHolderOnly
        activeProposalOnly(proposalIndex)
    {

        Proposal storage proposal = proposals[proposalIndex];

        // uint256 voterNFTBalance = foundation.balanceOf(msg.sender);
        uint256 numVotes = 1;

        // Calculate how many NFTs are owned by the voter
        // that haven't already been used for voting on this proposal
        // for (uint256 i = 0; i < voterNFTBalance; i++) {
            // console.log(cryptoDevsNFT.tokenOfOwnerByIndex(msg.sender, i));
            // uint256 tokenId = cryptoDevsNFT.tokenOfOwnerByIndex(msg.sender, i);
            // if (proposal.voters[tokenId] == false) {
            //     numVotes++;
            //     proposal.voters[tokenId] = true;
            // }
        // }
  
        require(numVotes > 0, "ALREADY_VOTED");

        if (vote == Vote.YES) {
            proposal.forProposalVotes += numVotes;
        } else {
            proposal.againstProposalVotes += numVotes;
        }
    }

    function getContent() public view returns(string memory) {
        return _content;
    } 

}