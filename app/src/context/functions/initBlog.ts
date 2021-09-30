import { Program } from "@project-serum/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

export async function initBlog(
  program: Program,
  blogKey: PublicKey,
  walletKey: PublicKey
) {
  try {
    const blog: any = await program.account.blogState.fetch(blogKey);
    return blog;
  } catch {
    const blogAccount = Keypair.generate();
    const genesisPostAccount = Keypair.generate();

    await program.rpc.initBlog({
      accounts: {
        authority: walletKey,
        systemProgram: SystemProgram.programId,
        blogAccount: blogAccount.publicKey,
        genesisPostAccount: genesisPostAccount.publicKey,
      },
      signers: [blogAccount, genesisPostAccount],
    });

    const blog = await program.account.blogState.fetch(blogAccount.publicKey);

    console.log("Blog pubkey: ", blogAccount.publicKey.toString());
    return blog;
  }
}
