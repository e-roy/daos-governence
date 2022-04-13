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
  };
};

export const uploadIpfs = async ({ payload }: uploadIpfsProps) => {
  // console.log("ipfs upload payload", payload);
  const result = await client.add(
    JSON.stringify({
      version: "1.0.0",
      metadata_id: uuidv4(),
      description: payload.description,
      content: payload.content,
      external_url: null,
      image: payload.media.length > 0 ? payload.media[0]?.item : null,
      imageMimeType: payload.media.length > 0 ? payload.media[0]?.type : null,
      name: payload.name,
      attributes: [],
      media: payload.media || [],
      // appId: "",
    })
  );

  // console.log("upload result ipfs", result);
  return result;
};
