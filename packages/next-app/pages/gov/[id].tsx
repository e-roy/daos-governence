import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";

import { MetadataForm } from "@/components/ipfs";
import { ProposalCard } from "@/components/cards";

const DaoGovernancePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  else return <DaoGovernance id={id} />;
};

export default DaoGovernancePage;

type contentType = {
  id: string;
  name: string;
  description: string;
  content: string;
};

const DaoGovernance = ({ id }) => {
  const [content, setContent] = useState<contentType>({} as contentType);
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

  console.log("governanceContract", governanceContract);

  useEffect(() => {
    if (governanceContract.signer && id) {
      const fetchData = async () => {
        try {
          const content = await governanceContract.getContent();
          //   console.log("content", content);
          await fetch(content)
            .then((res) => res.json())
            .then((data) => {
              //   console.log("data", data);
              setContent(data);
            });
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [governanceContract, id]);

  const handleMetadataForm = async (val) => {
    console.log(val);
    const tx = await governanceContract.createProposal(totalProposals);
    await tx.wait();
    console.log("tx", tx);
  };

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
      console.log("proposals", proposals);
      setProposals(proposals);
      return proposals;
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (governanceContract.signer && totalProposals) {
      fetchAllProposals();
    }
  }, [governanceContract, totalProposals]);

  useEffect(() => {
    if (governanceContract.signer && id) {
      const fetchData = async () => {
        const numOfProposals = await governanceContract.numProposals();
        console.log("proposals # :", Number(numOfProposals), numOfProposals);
        setTotalProposals(Number(numOfProposals));
      };
      fetchData();
    }
  }, [governanceContract, id]);

  return (
    <div>
      <h1>Doa Governance Contract Page</h1>
      <div>name: {content.name}</div>
      <div>description: {content.description}</div>
      <div>content: {content.content}</div>
      <MetadataForm
        onSubmit={(val) => {
          handleMetadataForm(val);
        }}
        buttonName="create proposal"
      />
      <div className="m-4 p-2 border">
        {proposals.map((proposal, index) => (
          <ProposalCard
            key={index}
            proposal={proposal}
            contract={governanceContract}
          />
        ))}
      </div>
    </div>
  );
};
