import { Program } from "@project-serum/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

export async function getPostById(postId: string, program: Program) {
  try {
    const post: any = await program.account.postState.fetch(
      new PublicKey(postId)
    );

    const userId = post.user.toString();
    if (userId === SystemProgram.programId.toString()) {
      return;
    }

    return {
      id: postId,
      title: post.title,
      content: post.content,
      userId,
      prePostId: post.prePostKey.toString(),
    };
  } catch (e: any) {
    console.log(e.message);
  }
}
