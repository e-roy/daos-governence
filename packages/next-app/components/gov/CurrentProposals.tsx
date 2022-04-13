import { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";
import { ProposalCard } from "@/components/cards";

export const CurrentProposals = ({ id }) => {
  //   const [content, setContent] = useState<contentType>({} as contentType);
  const [totalProposals, setTotalProposals] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [{ data: signerData }] = useSigner();
  const chainId = Number(config.network.id);

  const governanceABI = contracts[chainId][0].contracts.Governance.abi;
  const governanceContract = useContract({
    addressOrName: id,
    contractInterface: governanceABI,
    signerOrProvider: signerData,
  });
  const fetchProposalById = async (id) => {
    try {
      const proposal = await governanceContract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        nftTokenId: proposal.nftTokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yayVotes: proposal.yesVotes.toString(),
        nayVotes: proposal.noVotes.toString(),
        executed: proposal.executed,
      };
      return parsedProposal;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllProposals = async () => {
    try {
      const proposals = [];
      for (let i = 0; i < totalProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      // console.log("proposals", proposals);
      setProposals(proposals);
      return proposals;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-4 p-2 border text-stone-700">
      current
      {proposals.map((proposal, index) => (
        <ProposalCard
          key={index}
          proposal={proposal}
          contract={governanceContract}
        />
      ))}
    </div>
  );
};
