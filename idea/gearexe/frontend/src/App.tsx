import "./index.css";
// import { useAccount } from "wagmi";

import {
  ErrorFallback,
  Header,
  Layout,
  Loader,
  Navigation,
} from "@/components";
import { Routing } from "@/pages";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router-dom";
import { withProviders } from "./app/providers";
import { Activity } from "./features/activity/ui/Activity";

function App() {
  const { pathname } = useLocation();
  // const ethAccount = useAccount();
  // const isConnected = Boolean(ethAccount.chain);

  const isAppReady = true;

  return (
    <main className="main">
      <Header />
      <Layout>
        <ErrorBoundary key={pathname} fallbackRender={ErrorFallback}>
          <div>
            <Navigation />
            {isAppReady ? <Routing /> : <Loader />}
          </div>
          <Activity />
        </ErrorBoundary>
      </Layout>
    </main>
  );
}

export default withProviders(App);
