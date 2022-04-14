import { create } from "ipfs-http-client";
import { v4 as uuidv4 } from "uuid";

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

type uploadIpfsProps = {
  payload: {
    name: string;
    description: string;
    content: string;
    media: any[];
    address: string;
    sig: string;
    data: {
      domain: {
        name: string;
        version: string;
      };
      types: any;
      message: {
        space: string;
        type: string;
        title: string;
        body: string;
        choices: any[];
        start: number;
        end: number;
        network: string;
        from: string;
        timestamp: number;
      };
    };
  };
};

export const uploadIpfs = async ({ payload }: uploadIpfsProps) => {
  // console.log("ipfs upload payload", payload);
  const result = await client.add(
    JSON.stringify({
      version: "1.0.0",
      metadata_id: uuidv4(),
      name: payload.name,
      description: payload.description,
      content: payload.content,
      external_url: null,
      image: payload.media.length > 0 ? payload.media[0]?.item : null,
      imageMimeType: payload.media.length > 0 ? payload.media[0]?.type : null,
      attributes: [],
      media: payload.media || [],
      address: payload.address || "",
      sig: payload.sig || "",
      data: payload.data,

      // appId: "",
    })
  );

  // console.log("upload result ipfs", result);
  return result;
};
