import * as React from "react";
import { useConnect } from "wagmi";
import { Button } from "@/components/elements";

import { useIsMounted } from "@/hooks";

export const Connect = () => {
  const isMounted = useIsMounted();
  const [
    {
      data: { connector, connectors },
      error,
      loading,
    },
    connect,
  ] = useConnect();

  return (
    <div>
      <div>
        {connectors.map((x) => (
          <Button
            disabled={isMounted && !x.ready}
            key={x.name}
            onClick={() => connect(x)}
            className="border p-2 rounded"
          >
            connect with{" "}
            {x.id === "injected" ? (isMounted ? x.name : x.id) : x.name}
            {isMounted && !x.ready && " (unsupported)"}
            {loading && x.name === connector?.name && "…"}
          </Button>
        ))}
      </div>
      <div>{error && (error?.message ?? "Failed to connect")}</div>
    </div>
  );
};
