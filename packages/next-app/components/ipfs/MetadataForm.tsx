import { useState } from "react";
import { uploadIpfs } from "@/lib/ipfs/ipfs";
import { Button } from "@/components/elements";

type MetadataFormProps = {
  onSubmit: (metadata: any) => void;
  buttonName: string;
};

export const MetadataForm = ({ onSubmit, buttonName }: MetadataFormProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleForm = async (e) => {
    e.preventDefault();
    let media = [] as any[];
    // if (selectedPicture) {
    //   media = [
    //     {
    //       item: selectedPicture,
    //       type: "image/gif",
    //     },
    //   ];
    // }
    const payload = {
      name,
      description,
      content,
      media: media,
    };
    const result = await uploadIpfs({ payload });
    // console.log(result);
    const link = `https://ipfs.infura.io/ipfs/${result.path}`;
    // console.log(link);
    onSubmit(link);
  };
  return (
    <div className="">
      <form onSubmit={(e) => handleForm(e)}>
        <div className="my-2">
          <label>name</label>
          <div>
            <input
              value={name}
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded=lg w-full rounded outline-none"
            />
          </div>
        </div>
        <div className="my-2">
          <label>description</label>
          <div>
            <input
              value={description}
              placeholder="description"
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded=lg w-full rounded outline-none"
            />
          </div>
        </div>
        <div className="my-2">
          <label>content</label>
          <div>
            <input
              value={content}
              placeholder="content"
              onChange={(e) => setContent(e.target.value)}
              className="border p-2 rounded=lg w-full rounded outline-none"
            />
          </div>
        </div>

        <div className="my-4">
          <Button className="" type="submit">
            {buttonName}
          </Button>
        </div>
      </form>
    </div>
  );
};
