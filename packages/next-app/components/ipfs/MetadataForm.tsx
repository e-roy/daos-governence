import { uploadIpfs } from "@/lib/ipfs/ipfs";
import { Button } from "@/components/elements";

import { useForm } from "react-hook-form";

type MetadataFormProps = {
  onSubmit: (metadata: any) => void;
  buttonName: string;
};

export const MetadataForm = ({ onSubmit, buttonName }: MetadataFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formSubmit = async (data) => {
    const { name, description, content } = data;

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
      <form onSubmit={handleSubmit(formSubmit)}>
        <div className="my-2">
          <label>name</label>
          <input
            {...register("name")}
            placeholder="name"
            className="mt-2 mb-4 p-2 border rounded=lg w-full rounded outline-none resize-none text-stone-800 font-medium"
            required
          />
        </div>
        <div className="my-2">
          <label>description</label>
          <input
            {...register("description")}
            placeholder="description"
            className="mt-2 mb-4 p-2 border rounded=lg w-full rounded outline-none resize-none text-stone-800 font-medium"
            required
          />
        </div>
        <div className="my-2">
          <label className="">content</label>
          <textarea
            {...register("content")}
            placeholder="content"
            rows={12}
            className="mt-2 mb-4 p-2 border rounded=lg w-full rounded outline-none resize-none text-stone-800 font-medium"
            required
          />
        </div>

        <Button className="" type="submit">
          {buttonName}
        </Button>
      </form>
    </div>
  );
};
