import Link from "next/link";
import { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import config from "@/config.json";

type contentType = {
  id: string;
  name: string;
  description: string;
  content: string;
};

export const GovCard = ({ governance }) => {
  const [content, setContent] = useState<contentType>({} as contentType);
  const [{ data: signerData }] = useSigner();
  const chainId = Number(config.network.id);

  const governanceABI = contracts[chainId][0].contracts.Governance.abi;

  const governanceContract = useContract({
    addressOrName: governance.contract,
    contractInterface: governanceABI,
    signerOrProvider: signerData,
  });

  //   console.log("governance", governanceContract);

  useEffect(() => {
    if (governanceContract.signer) {
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
  }, [governanceContract, governance]);

  return (
    <div className="border cursor-pointer">
      <Link href={`/gov/${governance.contract}`} passHref>
        <div>
          <div>name: {content.name}</div>
          <div>description: {content.description}</div>
          <div>content: {content.content}</div>
        </div>
      </Link>
    </div>
  );
};
