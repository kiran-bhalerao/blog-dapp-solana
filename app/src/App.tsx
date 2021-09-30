import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { FC } from "react";
import { BlogProvider } from "src/context/Blog";
import { Router } from "src/router";

const wallets = [getPhantomWallet()];
const endPoint = clusterApiUrl("devnet");
// const localnetEndpoint = "http://localhost:8899"

export const App: FC = () => {
  return (
    <ConnectionProvider endpoint={endPoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <BlogProvider>
          <Router />
        </BlogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
