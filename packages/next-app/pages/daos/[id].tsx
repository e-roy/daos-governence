import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContract, useSigner, useNetwork } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";
import { CreateGovernance } from "@/components/daos";
import { GovCard } from "@/components/cards";

const DaoGroupPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [{ data: signerData }] = useSigner();
  const [{ data: networkData }] = useNetwork();

  const chainId = Number(config.network.id);

  const [totalGovernance, setTotalGovernance] = useState(0);
  const [governances, setGovernances] = useState([]);

  const governanceFactoryAddress =
    contracts[chainId][0].contracts.GovernanceFactory.address;
  const governanceFactoryABI =
    contracts[chainId][0].contracts.GovernanceFactory.abi;

  const governanceFactoryContract = useContract({
    addressOrName: governanceFactoryAddress,
    contractInterface: governanceFactoryABI,
    signerOrProvider: signerData,
  });

  //   console.log("foundation factory", governanceFactoryContract);

  const fetchGovernanceById = async (id) => {
    if (config.network.id !== networkData.chain.id) return null;
    try {
      const governance = await governanceFactoryContract.getGoverenceDetails(
        id
      );
      //   console.log("governance", governance);
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
        if (governance.doaAddress === id) governances.push(governance);
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
  }, [signerData, totalGovernance, id]);

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

  if (!id) return null;
  else
    return (
      <div className="w-full h-9/10">
        <div>dao : {id}</div>
        <div className="text-center text-2xl font-medium">Vote Gov</div>
        <div className="w-full">
          {governances &&
            governances.map((governance, index) => (
              <GovCard key={index} governance={governance} />
            ))}
        </div>
        <div className="text-center text-2xl font-medium">Vote Prop </div>
        <div className="text-center text-2xl font-medium">Vote Complete</div>
        <div className="text-center text-2xl font-medium">Previous</div>
        <CreateGovernance daoAddress={id as string} />
      </div>
    );
};

export default DaoGroupPage;
