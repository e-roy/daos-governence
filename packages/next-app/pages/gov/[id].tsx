import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";

import { CreateProposal, MarkdownDisplay } from "@/components/gov";

import { RewindIcon } from "@heroicons/react/outline";

const DaoGovernancePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  else return <DaoGovernance id={id} />;
};

export default DaoGovernancePage;

const DaoGovernance = ({ id }) => {
  const router = useRouter();
  const [proposalId, setProposalId] = useState<string>("");
  const [contentUrl, setContentUrl] = useState("");
  const [totalProposals, setTotalProposals] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [{ data: signerData }] = useSigner();
  const chainId = Number(config.network.id);

  const [govNav, setGovNav] = useState("markdown");

  const [status, setStatus] = useState("");
  const [created, setCreated] = useState("");
  const [createdTime, setCreatedTime] = useState("");

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
          const status = await governanceContract._governanceStatus();
          console.log("status", status);
          setStatus(status);
          const yes = await governanceContract._forGovernanceVotes();
          console.log("yes", yes);
          const no = await governanceContract._againstGovernanceVotes();
          console.log("no", no);
          const created = await governanceContract._timeCreated();
          console.log("created", created);
          // convert created from big number to number
          const createdNumber = created.toNumber();
          const createdDate = new Date(createdNumber * 1000);
          const locale = "en";
          // console.log(
          //   createdDate.toLocaleDateString(locale, {
          //     hour: "numeric",
          //     minute: "numeric",
          //     second: "numeric",
          //   })
          // );
          // console.log(typeof createdDate);
          const formattedDate = createdDate.toLocaleDateString(locale, {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          setCreated(formattedDate);

          const formattedTime = createdDate.toLocaleDateString(locale, {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });
          setCreatedTime(formattedTime);

          const govVoteEnd = await governanceContract._timeGovVoteEnd();
          console.log("govVoteEnd", govVoteEnd);
          const proposalSubmitEnd =
            await governanceContract._timeProposalSubmitEnd();
          console.log("proposalSubmitEnd", proposalSubmitEnd);
          const proposalVoteEnd =
            await governanceContract._timeProposalVoteEnd();
          console.log("proposalVoteEnd", proposalVoteEnd);

          const content = await governanceContract.getContent();
          console.log("content", content);
          setContentUrl(content);
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

  const voteOnProposal = async (proposalId, _vote) => {
    console.log(proposalId);
    try {
      let vote = _vote === "YES" ? 0 : 1;
      // const txn = await governanceContract.voteOnProposal(proposalId, vote);
      const txn = await governanceContract.voteOnGovernance(vote);
      // setLoading(true);
      await txn.wait();
      console.log(txn);
      // setLoading(false);
      await fetchAllProposals();
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-8 h-14/16">
        <div className="col-span-1">
          <div className="mb-4">
            <button
              className="flex font-medium border-2 py-1 px-4 rounded-xl border-stone-100/50 hover:border-stone-100"
              onClick={() => router.back()}
            >
              <RewindIcon className="w-6 h-6" />
              <span className="pl-2">Back</span>
            </button>
          </div>

          <div className="border rounded-xl p-4 h-13/16">
            <h1>Doa Governance Contract Page is here</h1>
            <div className="my-2">
              status :
              <span className="bg-green-700 ml-2 py-1 px-2 rounded-xl text-sm">
                {status}
              </span>
            </div>
            <div>{created}</div>
            <div>{createdTime}</div>
            <button
              className="my-1 w-full border-2 p-1 rounded-xl border-stone-100/50 hover:border-stone-100"
              onClick={() => setGovNav("markdown")}
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

            {proposals &&
              proposals.map((proposal, index) => (
                <button
                  key={index}
                  className="my-1 w-full border-2 p-1 rounded-xl border-stone-100/50 hover:border-stone-100"
                  onClick={() => {
                    console.log(proposal);
                    setProposalId(proposal.proposalId);
                    setContentUrl(proposal.content);
                    setGovNav("markdown");
                  }}
                >
                  Proposal id : {proposal.proposalId}
                </button>
              ))}
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-stone-100 h-13/16 p-4 rounded-xl overflow-y-scroll">
            {govNav === "markdown" && <MarkdownDisplay url={contentUrl} />}
            {govNav === "create" && <CreateProposal daoAddress={id} />}
          </div>
          <div className="w-full flex space-x-8 mt-4">
            <button
              className="w-full border-2 p-1 rounded-xl border-stone-100/50 hover:border-stone-100"
              onClick={() => voteOnProposal(proposalId, "YES")}
            >
              Vote For
            </button>
            <button
              className="w-full border-2 p-1 rounded-xl border-stone-100/50 hover:border-stone-100"
              onClick={() => voteOnProposal(proposalId, "NO")}
            >
              Vote Against
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
