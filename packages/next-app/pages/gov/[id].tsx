import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";

import { CreateProposal, ProposalDisplay } from "@/components/gov";

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
  const [contentUrl, setContentUrl] = useState("");
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
          // console.log("content", content);
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
      // console.log("proposal", proposal);
      const parsedProposal = {
        proposalId: id,
        nftTokenId: proposal.nftTokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        content: proposal.content,
        doaAddress: proposal.doaAddress,
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
            <div className="my-2">
              status :
              <span className="bg-green-700 ml-2 py-1 px-2 rounded-xl text-sm">
                taking proposals
              </span>
            </div>
            <button
              className="my-1 w-full border-2 p-1 rounded-xl border-stone-100/50 hover:border-stone-100"
              onClick={() => setGovNav("governance")}
            >
              governance
            </button>
            <button
              className="my-1 w-full border-2 p-1 rounded-xl border-stone-100/50 hover:border-stone-100"
              onClick={() => setGovNav("create")}
            >
              create proposal
            </button>
            <div className="h-0.5 bg-stone-500 my-2"></div>

            {proposals.map((proposal, index) => (
              <button
                key={index}
                className="my-1 w-full border-2 p-1 rounded-xl border-stone-100/50 hover:border-stone-100"
                onClick={() => {
                  setContentUrl(proposal.content);
                  setGovNav("current");
                }}
              >
                Proposal id : {proposal.proposalId}
              </button>
            ))}
          </div>

          <div className="bg-stone-100 py-4 my-4 flex justify-center mx-2 p-4 w-full rounded-xl h-8/10 overflow-y-scroll">
            {govNav === "governance" && (
              <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
                {content.content}
              </ReactMarkdown>
            )}
            {govNav === "create" && <CreateProposal daoAddress={id} />}
            {govNav === "current" && <ProposalDisplay url={contentUrl} />}
          </div>
        </div>
        <div className="flex -mt-4">
          <div className="w-1/3"></div>
          <div className="w-2/3 bg-black">voting</div>
        </div>
      </div>
    </div>
  );
};
