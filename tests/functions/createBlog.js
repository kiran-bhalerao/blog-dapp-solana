const anchor = require("@project-serum/anchor");

const { SystemProgram } = anchor.web3;

async function createBlog(program, provider) {
  const initBlogAccount = anchor.web3.Keypair.generate();
  const genesisPostAccount = anchor.web3.Keypair.generate();

  await program.rpc.initBlog({
    accounts: {
      authority: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
      blogAccount: initBlogAccount.publicKey,
      genesisPostAccount: genesisPostAccount.publicKey,
    },
    signers: [initBlogAccount, genesisPostAccount],
  });

  const blog = await program.account.blogState.fetch(initBlogAccount.publicKey);

  return { blog, blogAccount: initBlogAccount, genesisPostAccount };
}

module.exports = {
  createBlog,
};
