import { Header } from "@/components/layout";
import { BetaView, SidebarNav } from "@/components/layout";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    return (
      <main className="h-screen bg-stone-800 text-stone-100 overflow-hidden">
        <header className="h-1/10">
          <Header />
        </header>

        <div className="flex-1 flex">
          <SidebarNav />
          <div className="w-full h-9/10 mx-8 -mt-4 border rounded-lg p-4 overflow-y-scroll">
            {children}
          </div>
        </div>
      </main>
    );
  } else {
    return <BetaView />;
  }
};
