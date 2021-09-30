import { Idl, Program, Provider } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getPostById } from "src/context/functions/getPostById";
import { getPosts } from "src/context/functions/getPosts";
import { getUser } from "src/context/functions/getUser";
import { initBlog } from "src/context/functions/initBlog";
import { getAvatarUrl } from "src/functions/getAvatarUrl";
import { getRandomName } from "src/functions/getRandomName";
import idl from "src/idl.json";

const PROGRAM_KEY = new PublicKey(idl.metadata.address);
const BLOG_KEY = new PublicKey("Gx7dKodSkhsbEvrXtVVECdC6a4sPb22iB3pCSmcVqBBp");

// create unique user key
export const getUserKey = (walletKey: PublicKey) => {
  const userAccount = Keypair.fromSeed(
    new TextEncoder().encode(
      `${PROGRAM_KEY.toString().slice(0, 15)}__${walletKey
        .toString()
        .slice(0, 15)}`
    )
  );

  return userAccount;
};

function getProgram(provider: Provider) {
  return new Program(idl as Idl, PROGRAM_KEY, provider);
}

interface PostData {
  title: string;
  content: string;
}

export interface Post extends PostData {
  id: string;
  userId: string;
  prePostId: string | null;
}

interface UserData {
  name: string;
  avatar: string;
}

interface User extends UserData {
  id: string;
}

interface IBlogContext {
  user: User | undefined;
  posts: Post[];
  createPost: (data: PostData) => Promise<string | undefined>;
  updatePost: (oldPost: Post, data: PostData) => Promise<string | undefined>;
  deletePost: (
    postId: string,
    nextPostId: string
  ) => Promise<string | undefined>;
  deleteLatestPost: (postId: string) => Promise<string | undefined>;
  updateUser: (name: string) => Promise<string | undefined>;
  fetchUser: () => Promise<void>;
}

const BlogContext = createContext<IBlogContext>({
  user: undefined,
  posts: [],
  createPost: async () => undefined,
  updatePost: async () => undefined,
  deletePost: async () => undefined,
  deleteLatestPost: async () => undefined,
  updateUser: async () => undefined,
  fetchUser: async () => undefined,
});

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("Parent must be wrapped inside PostsProvider");
  }

  return context;
};

export const BlogProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [provider, setProvider] = useState<Provider>();

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const signupUser = useCallback(
    async (data: { name: string; avatar: string }) => {
      if (provider) {
        const { name, avatar } = data;
        const program = getProgram(provider);
        const userAccount = getUserKey(provider.wallet.publicKey);

        try {
          const tx = await program.rpc.signupUser(name, avatar, {
            accounts: {
              authority: provider.wallet.publicKey,
              userAccount: userAccount.publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [userAccount],
          });

          return tx;
        } catch {}
      }
    },
    [provider]
  );

  const fetchUser = useCallback(async () => {
    if (provider) {
      const program = getProgram(provider);
      const user = await getUser(program, provider.wallet.publicKey);

      if (!user) {
        const name = getRandomName();
        const avatar = getAvatarUrl(name);
        await signupUser({ name, avatar });
        const user = await getUser(program, provider.wallet.publicKey);

        setUser(user);
      } else {
        setUser(user);
      }
    }
  }, [provider, signupUser]);

  const updateUser = useCallback(
    async (name: string) => {
      const avatar = getAvatarUrl(name);
      if (provider) {
        const program = getProgram(provider);
        const userAccount = getUserKey(provider.wallet.publicKey);

        try {
          const tx = await program.rpc.updateUser(name, avatar, {
            accounts: {
              authority: provider.wallet.publicKey,
              userAccount: userAccount.publicKey,
              systemProgram: SystemProgram.programId,
            },
          });

          await fetchUser();
          return tx;
        } catch {}
      }
    },
    [fetchUser, provider]
  );

  const createPost = useCallback(
    async (data: PostData) => {
      if (!!provider && !!user) {
        const { title, content = "" } = data;
        const program = getProgram(provider);
        const postAccount = Keypair.generate();

        const tx = await program.rpc.createPost(title, content, {
          accounts: {
            blogAccount: BLOG_KEY,
            authority: provider.wallet.publicKey,
            userAccount: new PublicKey(user.id),
            postAccount: postAccount.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [postAccount],
        });

        return tx;
      }
    },
    [provider, user]
  );

  const updatePost = useCallback(
    async (oldPost: Post, data: PostData) => {
      if (provider) {
        const { title, content } = data;
        const program = getProgram(provider);

        const tx = await program.rpc.updatePost(title, content, {
          accounts: {
            authority: provider.wallet.publicKey,
            postAccount: new PublicKey(oldPost.id),
          },
        });

        const updatedPost = await getPostById(oldPost.id, program);
        if (updatedPost) {
          setPosts((posts) =>
            posts.map((D) => {
              if (D.id === oldPost.id) {
                return updatedPost;
              }

              return D;
            })
          );
        }

        return tx;
      }
    },
    [provider]
  );

  const deletePost = useCallback(
    async (postId: string, nextPostId: string) => {
      if (!!provider) {
        const program = getProgram(provider);

        const tx = await program.rpc.deletePost({
          accounts: {
            authority: provider.wallet.publicKey,
            postAccount: new PublicKey(postId),
            nextPostAccount: new PublicKey(nextPostId),
          },
        });

        return tx;
      }
    },
    [provider]
  );

  const deleteLatestPost = useCallback(
    async (postId: string) => {
      if (!!provider) {
        const program = getProgram(provider);

        const tx = await program.rpc.deleteLatestPost({
          accounts: {
            authority: provider.wallet.publicKey,
            postAccount: new PublicKey(postId),
            blogAccount: BLOG_KEY,
          },
        });

        return tx;
      }
    },
    [provider]
  );

  // set provider
  useEffect(() => {
    if (wallet) {
      const provider = new Provider(connection, wallet, {});
      setProvider(provider);
    }
  }, [connection, wallet]);

  // set initial posts
  useEffect(() => {
    let POST_EVENT_LISTENER: any;

    async function start() {
      if (provider) {
        const program = getProgram(provider);
        const blog: any = await initBlog(
          program,
          BLOG_KEY,
          provider.wallet.publicKey
        );

        // initially load all the posts
        const [observer] = getPosts({
          program,
          fromPostId: blog.currentPostKey.toString(),
        });

        observer.subscribe({
          next(post) {
            setPosts((posts) => [...posts, post]);
          },
          complete() {
            // listen create/update/delete post events,
            // after fetching all posts

            POST_EVENT_LISTENER = program.addEventListener(
              "PostEvent",
              async (event) => {
                const postId = event?.postId?.toString();
                const nextPostId = event?.nextPostId?.toString();

                if (postId) {
                  switch (event.label) {
                    case "CREATE":
                      const post = await getPostById(postId, program);

                      if (post) {
                        setPosts((posts) => [post, ...posts]);
                      }
                      break;

                    case "UPDATE":
                      const updatedPost = await getPostById(postId, program);
                      if (updatedPost) {
                        setPosts((posts) =>
                          posts.map((D) => {
                            if (D.id === postId) {
                              return updatedPost;
                            }

                            return D;
                          })
                        );
                      }
                      break;

                    case "DELETE":
                      const nextPost = nextPostId
                        ? await getPostById(nextPostId, program)
                        : null;

                      setPosts((posts) =>
                        posts
                          .filter(({ id }) => id !== postId)
                          .map((post) => {
                            if (post.id === nextPostId && nextPost) {
                              return nextPost;
                            }

                            return post;
                          })
                      );
                      break;

                    default:
                      break;
                  }
                }
              }
            );
          },
        });
      }
    }

    start();

    return () => {
      if (provider && POST_EVENT_LISTENER) {
        const program = getProgram(provider);

        program.removeEventListener(POST_EVENT_LISTENER).catch((e) => {
          console.log("error: ", e.message);
        });
      }
    };
  }, [provider]);

  return (
    <BlogContext.Provider
      value={{
        user,
        posts,
        createPost,
        updatePost,
        deletePost,
        fetchUser,
        updateUser,
        deleteLatestPost,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
