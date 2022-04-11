import type { NextPage } from "next";
import { useEffect, useState } from "react";

import { useContract, useSigner, useNetwork } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";

import { MetadataForm } from "@/components/ipfs";
import { GovCard } from "@/components/cards";
import { _fetchData } from "ethers/lib/utils";

const DaosPage: NextPage = () => {
  const [{ data: signerData }] = useSigner();
  const [{ data: networkData }, switchNetwork] = useNetwork();

  const [totalGovernance, setTotalGovernance] = useState(0);
  const [governances, setGovernances] = useState([]);
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

  // console.log("foundation factory", governanceFactoryContract);

  const fetchGovernanceById = async (id) => {
    if (config.network.id !== networkData.chain.id) return null;
    try {
      const governance = await governanceFactoryContract.getGoverenceDetails(
        id
      );
      // console.log("governance", governance);
      const parsedGovernance = {
        id: governance._goverenceIndex,
        contract: governance._contract,
        owner: governance._owner,
        doaAddress: governance._doaAddress,
      };
      return parsedGovernance;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllGovernances = async () => {
    if (config.network.id !== networkData.chain.id) return null;
    try {
      const governances = [];
      for (let i = 0; i < totalGovernance; i++) {
        const governance = await fetchGovernanceById(i);
        governances.push(governance);
      }
      // console.log("governances", governances);
      setGovernances(governances);
      return governances;
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (signerData && totalGovernance) {
      fetchAllGovernances();
    }
  }, [signerData, totalGovernance]);

  useEffect(() => {
    if (signerData && governanceFactoryContract) {
      if (config.network.id !== networkData.chain.id) return;
      const fetchData = async () => {
        const numOfGoverences =
          await governanceFactoryContract.numGovernances();
        // console.log("goverences # :", Number(numOfGoverences), numOfGoverences);
        setTotalGovernance(Number(numOfGoverences));
      };
      fetchData();
    }
  }, [signerData, governanceFactoryContract]);

  const handleMetadataForm = async (val: string) => {
    // console.log(val);
    if (config.network.id !== networkData.chain.id) return null;
    const tx = await governanceFactoryContract.createGovernance(
      val,
      daoAddress
    );
    // setContractName("");
    let result = await tx.wait();

    // console.log("tx", result);
    const numOfGoverences = await governanceFactoryContract.numGovernances();
    // console.log("goverences # :", Number(numOfGoverences), numOfGoverences);
    setTotalGovernance(Number(numOfGoverences));
  };

  return (
    <div className="m-4">
      <button onClick={() => fetchAllGovernances()}>
        total: {totalGovernance}
      </button>

      {governances &&
        governances.map((governance, index) => (
          <GovCard key={index} governance={governance} />
        ))}
      <div className="border rounded-lg my-4 p-4">
        <div className="my-2">
          <label>dao address</label>
          <div>
            <input
              value={daoAddress}
              placeholder="dao address"
              onChange={(e) => setDaoAddress(e.target.value)}
              className="border p-2 rounded=lg w-full rounded outline-none"
            />
          </div>
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

export default DaosPage;
