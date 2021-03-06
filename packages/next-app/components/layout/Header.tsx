import { Connect, SwitchNetwork } from "@/components/wallet";
import { Button } from "@/components/elements";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

export type HeaderProps = {};

export const Header = ({}: HeaderProps) => {
  const router = useRouter();
  const [{ data: accountData, error, loading }, disconnect] = useAccount();
  return (
    <div className="flex justify-between p-2">
      <div className="cursor-pointer" onClick={() => router.push(`/`)}></div>
      <SwitchNetwork />

      {!accountData ? (
        <Connect />
      ) : (
        <Button
          disabled={loading}
          onClick={() => disconnect()}
          className="border p-2 rounded w-32"
        >
          disconnect
        </Button>
      )}
    </div>
  );
};
