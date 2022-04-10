import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { ethers } from "ethers";

import { Connect } from "../components/Connect";

import { useContract, useSigner } from "wagmi";

import contracts from "../contracts/hardhat_contracts.json";
import config from "../config.json";
import { useEffect, useState } from "react";

import { ProposalCard } from "@/components/cards";
import { MetadataForm } from "@/components/ipfs";

const dummyURI =
  "https://ipfs.infura.io/ipfs/QmaPaiHbmoMv7iuM3AeaTVhxQQm39mBzphu9KXzNHy1geU";

const Landing: NextPage = () => {
  const [contractName, setContractName] = useState<string>("");
  const [contractContent, setContractContent] = useState<string>("");
  const [contractOwnedBy, setContractOwnedBy] = useState<string>("");
  const [indexOf, setIndexOf] = useState<number>(0);
  const [totalContracts, setTotalContracts] = useState<number>(0);
  const [checkContractName, setCheckContractName] = useState<string>("");
  const [totalProposals, setTotalProposals] = useState(0);
  const [proposals, setProposals] = useState([]);

  const [usersContract, setUsersContract] = useState<string>(
    "0x0000000000000000000000000000000000000000"
  );

  const [{ data: signerData }] = useSigner();

  const chainId = Number(config.network.id);
  console.log("chainId", chainId);
  const network = config.network.name;
  console.log("network", network);

  const foundationFactoryAddress =
    contracts[chainId][0].contracts.FoundationFactory.address;
  const foundationFactoryABI =
    contracts[chainId][0].contracts.FoundationFactory.abi;

  // console.log("foundationFactoryAddress", foundationFactoryAddress);
  // console.log("foundationFactoryABI", foundationFactoryABI);

  const foundationFactoryContract = useContract({
    addressOrName: foundationFactoryAddress,
    contractInterface: foundationFactoryABI,
    signerOrProvider: signerData,
  });

  console.log("foundation factory", foundationFactoryContract);

  const foundationAddress = contracts[chainId][0].contracts.Foundation.address;
  const foundationABI = contracts[chainId][0].contracts.Foundation.abi;

  const foundationContract = useContract({
    addressOrName: usersContract,
    contractInterface: foundationABI,
    signerOrProvider: signerData,
  });

  console.log("foundation", foundationContract);

  const fetchData = async () => {
    const numOfGoverences = await foundationFactoryContract.numGovernances();
    console.log("goverences # :", Number(numOfGoverences), numOfGoverences);
    setTotalContracts(Number(numOfGoverences));
    // const total = await foundationFactoryContract.getCounter();
    // console.log("total contracts", total);
    // console.log(ethers.utils.formatUnits(total, 1) * 10);
    // setTotalContracts(ethers.utils.formatUnits(total, 1) * 10);
    if (usersContract !== "0x0000000000000000000000000000000000000000") {
      // let id = 1;
      // const proposal = await foundationContract.proposals(id);
      // console.log("proposal", proposal);
    }
  };

  useEffect(() => {
    if (signerData) {
      fetchData();
    }
  }, [signerData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const tx = await foundationFactoryContract.createFoundation(
      contractName,
      dummyURI
    );
    setContractName("");
    let result = await tx.wait();
    console.log("tx", result);
    fetchData();
  };

  const fetchProposalById = async (id) => {
    try {
      const proposal = await foundationContract.proposals(id);
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

  const handleCheck = async () => {
    const tx = await foundationFactoryContract.getGoverenceDetails(indexOf);
    setUsersContract(tx._contract);
    console.log("handle check");
    console.log("tx", tx);
    if (usersContract !== "0x0000000000000000000000000000000000000000") {
      // const ownedBy = await foundationContract.ownerOf();
      // console.log("ownedBy", ownedBy);
      // setContractOwnedBy(ownedBy);
      const name = await foundationContract.name();
      console.log("name", name);
      setCheckContractName(name);
      const _name = await foundationContract._name();
      console.log("_name", _name);
      const content = await foundationContract._content();
      console.log("content", content);
      setContractContent(content);
      const numOfProposals = await foundationContract.numProposals();
      console.log("proposals # :", Number(numOfProposals), numOfProposals);
      setTotalProposals(Number(numOfProposals));
      const numOfGoverences = await foundationFactoryContract.numGovernances();
      console.log("goverences # :", Number(numOfGoverences), numOfGoverences);
      fetchAllProposals();
    }
  };

  const handleProposal = async () => {
    console.log("handle proposal");
    const tx = await foundationContract.createProposal(1);
    await tx.wait();
    console.log("tx", tx);
  };

  return (
    <div className={``}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={``}>
        <div>
          <Connect />
        </div>
        <div className="m-4 p-2 border">
          <div>current contract : {usersContract}</div>
          <div>total contracts : {totalContracts}</div>
          <div>contract OwnedBy : {contractOwnedBy}</div>
          <div>contract Name : {checkContractName}</div>
          <div>content : {contractContent}</div>

          <form onSubmit={(e) => handleCreate(e)}>
            <input
              required
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              className="border p-2 rounded=lg"
            />
            <button
              className="text-red-500 border p-1 hover:bg-gray-200"
              type="submit"
            >
              new governance
            </button>
          </form>
        </div>

        <div className="border m-4 p-2">
          <button
            onClick={() => handleCheck()}
            className="text-red-500 border p-1 hover:bg-gray-200"
          >
            check foundation address for
          </button>
          <input
            className="border"
            type="number"
            value={indexOf}
            onChange={(e) => setIndexOf(Number(e.target.value))}
          />
        </div>

        <MetadataForm />
        <div className="m-4 p-2 border">
          {/* <input type="number" value={0} /> */}
          <button
            onClick={() => handleProposal()}
            className="text-red-500 border p-1 hover:bg-gray-200"
          >
            create proposal
          </button>
        </div>
        <div className="m-4 p-2 border">
          {proposals.map((proposal, index) => (
            <ProposalCard
              key={index}
              proposal={proposal}
              contract={foundationContract}
            />
          ))}
        </div>
      </main>

      <footer className={``}></footer>
    </div>
  );
};

export default Landing;
