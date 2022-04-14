import { MetadataForm } from "@/components/ipfs";
import { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";

type CreateProposalProps = {
  daoAddress: string;
};

export const CreateProposal = ({ daoAddress }: CreateProposalProps) => {
  const [{ data: signerData }] = useSigner();
  const chainId = Number(config.network.id);

  const governanceABI = contracts[chainId][0].contracts.Governance.abi;
  const governanceContract = useContract({
    addressOrName: daoAddress,
    contractInterface: governanceABI,
    signerOrProvider: signerData,
  });

  const handleMetadataForm = async (val) => {
    console.log(val);
    const tx = await governanceContract.createProposal(val, daoAddress);
    const result = await tx.wait();
    console.log(result);
    // const numOfProposals = await governanceContract.numProposals();
    // setTotalProposals(Number(numOfProposals));
  };

  return (
    <div className="w-full text-stone-700 font-medium">
      <div>create proposal</div>
      <MetadataForm
        onSubmit={(val) => {
          handleMetadataForm(val);
        }}
        buttonName="create proposal"
      />
    </div>
  );
};
