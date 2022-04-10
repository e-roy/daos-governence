import { Button } from "@/components/elements";

type ProposalCardProps = {
  proposal: any;
  contract: any;
};

export const ProposalCard = ({ proposal, contract }: ProposalCardProps) => {
  //   console.log(proposal);
  //   console.log(contract);
  const handleVote = async (proposalId, _vote: string) => {
    // console.log("handle vote");
    // console.log("proposalId", proposalId);
    try {
      let vote = _vote === "YES" ? 0 : 1;
      const tx = await contract.voteOnProposal(proposalId, vote);
      await tx.wait();
      //   console.log("tx", tx);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="p-2 border border-gray-800">
      <div className="flex justify-between">
        <span>Proposal ID: {proposal.proposalId}</span>
        <span>Deadline: {proposal.deadline.toLocaleString()}</span>
      </div>
      <p>Fake NFT to Purchase: {proposal.nftTokenId}</p>
      <div className="flex">
        <span>YES : {proposal.yesVotes}</span>
        <span className="pl-8">NO : {proposal.noVotes}</span>
      </div>
      <p>Executed?: {proposal.executed.toString()}</p>
      {proposal.deadline.getTime() > Date.now() && !proposal.executed ? (
        <div className={"flex"}>
          <Button
            className="text-red-500 border p-1 hover:bg-gray-200"
            onClick={() => handleVote(proposal.proposalId, "YES")}
          >
            Vote YES
          </Button>
          <Button
            className="text-red-500 border p-1 hover:bg-gray-200"
            onClick={() => handleVote(proposal.proposalId, "NO")}
          >
            Vote NO
          </Button>
        </div>
      ) : proposal.deadline.getTime() < Date.now() && !proposal.executed ? (
        <div className={""}>execute</div>
      ) : (
        <div className={""}>Proposal Executed</div>
      )}
    </div>
  );
};
