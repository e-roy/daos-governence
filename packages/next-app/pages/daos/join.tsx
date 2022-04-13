import type { NextPage } from "next";
import { useState } from "react";
import { useContract, useSigner, useNetwork } from "wagmi";

import { MetadataForm } from "@/components/ipfs";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";

const JoinPage: NextPage = () => {
  const [{ data: signerData }] = useSigner();
  const [{ data: networkData }] = useNetwork();

  const [daoAddress, setDaoAddress] = useState("");

  const chainId = Number(config.network.id);

  const governanceFactoryAddress =
    contracts[chainId][0].contracts.GovernanceFactory.address;
  const governanceFactoryABI =
    contracts[chainId][0].contracts.GovernanceFactory.abi;

  const governanceFactoryContract = useContract({
    addressOrName: governanceFactoryAddress,
    contractInterface: governanceFactoryABI,
    signerOrProvider: signerData,
  });
  const handleMetadataForm = async (val: string) => {
    if (config.network.id !== networkData.chain.id || !daoAddress) return null;
    const tx = await governanceFactoryContract.createGovernance(
      val,
      daoAddress
    );
    await tx.wait();
    // console.log(result);
  };

  return (
    <div className="overflow-y-auto h-9/10">
      <div>join dao page</div>
      <div className="border rounded-lg my-4 p-4">
        <div className="my-2">
          <label>dao address</label>
          <input
            value={daoAddress}
            onChange={(e) => setDaoAddress(e.target.value)}
            placeholder="dao address"
            className="mt-2 mb-4 p-2 border rounded=lg w-full rounded outline-none resize-none text-stone-800 font-medium"
            required
          />
        </div>
        <MetadataForm
          onSubmit={(val) => {
            handleMetadataForm(val);
          }}
          buttonName="create new governance"
        />
      </div>
    </div>
  );
};

export default JoinPage;
