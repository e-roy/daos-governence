import { useState } from "react";
import { useContract, useSigner, useNetwork } from "wagmi";

import { MetadataForm } from "@/components/ipfs";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";

type CreateGovernanceProps = {
  daoAddress?: string;
};

export const CreateGovernance = ({ daoAddress }: CreateGovernanceProps) => {
  const [{ data: signerData }] = useSigner();
  const [{ data: networkData }] = useNetwork();
  const [isOpen, setIsOpen] = useState(false);

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
    <div>
      <div
        className="p-4 border rounded-lg cursor-pointer hover:bg-stone-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        create new governance
      </div>
      {isOpen && (
        <div className="border rounded-lg my-4 p-4">
          <MetadataForm
            onSubmit={(val) => {
              handleMetadataForm(val);
            }}
            buttonName="create new governance"
          />
        </div>
      )}
    </div>
  );
};
