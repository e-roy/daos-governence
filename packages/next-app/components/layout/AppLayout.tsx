import { Header } from "@/components/layout";
import { BetaView } from "@/components/layout";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    );
  } else {
    return <BetaView />;
  }
};
