import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useContract, useSigner, useNetwork } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";

export const SidebarNav = () => {
  const [{ data: signerData }] = useSigner();
  const [{ data: networkData }] = useNetwork();
  const router = useRouter();

  const [governances, setGovernances] = useState([]);
  const [totalGovernance, setTotalGovernance] = useState(0);

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
      // fetch all governances by id and cound the number of time each time key daoAdress is the same
      for (let i = 0; i < totalGovernance; i++) {
        const governance = await fetchGovernanceById(i);
        if (governance) {
          const index = governances.findIndex(
            (item) => item.doaAddress === governance.doaAddress
          );
          if (index === -1) {
            governances.push({
              id: governance.id,
              count: 1,
              doaAddress: governance.doaAddress,
            });
          } else {
            governances[index].count++;
          }
        }
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
  return (
    <div className="h-9/10 overflow-y-auto mx-2 -mt-4 w-20 border rounded-lg px-2 py-4">
      {governances.map((governance, index) => (
        <button
          key={index}
          className="mx-auto my-2 inline-block relative cursor-pointer"
          onClick={() => router.push(`/daos/${governance.doaAddress}`)}
        >
          <div
            className={"h-12 w-12 rounded-full bg-stone-100 hover:bg-stone-200"}
            // src={
            //   "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            // }
            // alt={governance.doaAddress}
          />

          <span className="absolute bottom-0 right-0 block bg-red-600 px-1.5 text-sm rounded-full">
            {governance.count}
          </span>
        </button>
      ))}
    </div>
  );
};
