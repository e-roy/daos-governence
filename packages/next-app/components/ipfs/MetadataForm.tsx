import { useState } from "react";
import { uploadIpfs } from "@/lib/ipfs/ipfs";

export const MetadataForm = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const handleForm = async (e) => {
    e.preventDefault();
    console.log("handle form");
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
    console.log(result);
    const link = `https://ipfs.infura.io/ipfs/${result.path}`;
    console.log(link);
  };
  return (
    <div className="border m-4 p-2">
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
          <button
            className="text-red-500 border p-2 hover:bg-gray-200 rounded-lg"
            type="submit"
          >
            create uri
          </button>
        </div>
      </form>
    </div>
  );
};
