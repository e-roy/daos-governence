import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";

import { ProposalCard } from "@/components/cards";

import { CreateProposal, CurrentProposals } from "@/components/gov";

import { RewindIcon } from "@heroicons/react/outline";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const router = useRouter();
  const [content, setContent] = useState<contentType>({} as contentType);
  const [totalProposals, setTotalProposals] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [{ data: signerData }] = useSigner();
  const chainId = Number(config.network.id);

  const [govNav, setGovNav] = useState("governance");

  const governanceABI = contracts[chainId][0].contracts.Governance.abi;
  const governanceContract = useContract({
    addressOrName: id,
    contractInterface: governanceABI,
    signerOrProvider: signerData,
  });

  // console.log("governanceContract", governanceContract);

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
  useEffect(() => {
    if (governanceContract.signer && totalProposals) {
      fetchAllProposals();
    }
  }, [governanceContract, totalProposals]);

  useEffect(() => {
    if (governanceContract.signer && id) {
      const fetchData = async () => {
        const numOfProposals = await governanceContract.numProposals();
        // console.log("proposals # :", Number(numOfProposals), numOfProposals);
        setTotalProposals(Number(numOfProposals));
      };
      fetchData();
    }
  }, [governanceContract, id]);

  // console.log("content", content);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <button
          className="flex font-medium border-2 py-1 px-2 rounded-xl border-stone-100/50 hover:border-stone-100"
          onClick={() => router.back()}
        >
          <RewindIcon className="w-6 h-6" />
          <span className="pl-2">Back</span>
        </button>
      </div>

      <div className="">
        <div className="flex">
          <div className="border rounded-xl my-4 p-4 w-1/3">
            <h1>Doa Governance Contract Page is here</h1>
            <div>name: {content.name}</div>
            <div>description: {content.description}</div>
            <button
              className="my-1 w-full border-2 p-1 rounded-xl border-stone-100/50 hover:border-stone-100"
              onClick={() => setGovNav("governance")}
            >
              governance
            </button>
            <button
              className="my-1 w-full border-2 p-1 rounded-xl border-stone-100/50 hover:border-stone-100"
              onClick={() => setGovNav("current")}
            >
              current
            </button>
          </div>

          <div className="bg-stone-100 py-4 my-4 flex justify-center mx-2 p-4 w-full rounded-xl h-8/10 overflow-y-scroll">
            {govNav === "governance" && (
              <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
                {content.content}
              </ReactMarkdown>
            )}
            {govNav === "current" && <CurrentProposals id={id} />}
          </div>
        </div>

        {/* <div className="m-4 p-2 border">
          {proposals.map((proposal, index) => (
            <ProposalCard
              key={index}
              proposal={proposal}
              contract={governanceContract}
            />
          ))}
        </div> */}
        {/* <CreateProposal daoAddress={id} /> */}
      </div>
    </div>
  );
};
