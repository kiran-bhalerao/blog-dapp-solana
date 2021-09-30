import { PublicKey } from "@solana/web3.js";

export const displayKey = (pubKey: PublicKey) => {
  const key = pubKey.toString();

  return key.length > 20
    ? `${key.substring(0, 4)}...${key.substring(key.length - 4, key.length)}`
    : key;
};
