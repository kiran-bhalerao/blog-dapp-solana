import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { getUserKey } from "src/context/Blog";

export async function getUser(program: Program, walletKey: PublicKey) {
  const userAccount = getUserKey(walletKey);

  try {
    const _user: any = await program.account.userState.fetch(
      userAccount.publicKey
    );

    const user = {
      id: userAccount.publicKey.toString(),
      name: _user.name,
      avatar: _user.avatar,
    };

    return user;
  } catch {}
}
