import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-wallets";
import { useCallback, useEffect, useState } from "react";
import { Button } from "src/components/Button";
import { EditProfile } from "src/components/EditProfile";
import { InterestingSkeleton } from "src/components/InterestingSkeleton";
import { PostCard } from "src/components/PostCard";
import { PostForm } from "src/components/PostForm";
import { SponsoredSkeleton } from "src/components/SponsoredSkeleton";
import { useBlog } from "src/context/Blog";
import { displayKey } from "src/functions/displayKey";

export const Dashboard = () => {
  const [connecting, setConnecting] = useState(false);
  const { connected, select, publicKey } = useWallet();
  const { user, posts, fetchUser, createPost } = useBlog();

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const onConnect = () => {
    setConnecting(true);
    select(WalletName.Phantom);
  };

  const onCreatePost = useCallback(
    async (title: string, content: string) => {
      try {
        await createPost({ title, content });
        setPostTitle("");
        setPostContent("");
      } catch {
        // show toast message
      }
    },
    [createPost]
  );

  useEffect(() => {
    if (publicKey) {
      fetchUser();
    }
  }, [fetchUser, publicKey]);

  useEffect(() => {
    if (user) {
      setConnecting(false);
    }
  }, [user]);

  return (
    <div className="dashboard background-color overflow-auto h-screen">
      <header className="fixed z-10 w-full h-14 glass shadow-md">
        <div className="flex justify-between items-center h-full container">
          <h2 className="text-2xl font-bold">
            👻{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-300  to-green-600">
              BloG
            </span>
          </h2>
          {connected ? (
            <div className="flex items-center">
              <img
                src={user?.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full bg-gray-200 shadow ring-2 ring-indigo-400 ring-offset-2 ring-opacity-50"
              />
              <p className="text-gray-600 font-bold text-sm ml-2 capitalize">
                {user?.name}
              </p>
            </div>
          ) : (
            <Button
              loading={connecting}
              className="w-28"
              onClick={onConnect}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
            >
              Connect
            </Button>
          )}
        </div>
      </header>
      <main className="dashboard-main pb-4 container flex relative">
        <aside className="flex-3 pt-6">
          <div className="dashboard-aside px-8">
            <h2 className="font-bold text-gray-500">
              You might find these posts interesting
            </h2>
            <InterestingSkeleton />
            <InterestingSkeleton />
            <hr className="h-1 w-full bg-gray-100 rounded-xl mt-4" />
            <div className="flex justify-between items-end mt-auto">
              <div className="flex w-full justify-between items-end">
                {connected ? (
                  <>
                    <div className="flex">
                      <img
                        src={user?.avatar}
                        alt="avatar"
                        className="w-12 h-12 rounded-full shadow g-gray-200 ring-2 ring-indigo-400 ring-offset-2 ring-opacity-50"
                      />
                      <div className="flex flex-col items-start">
                        <p className="text-gray-700 font-bold text-lg ml-3 capitalize">
                          {user?.name}
                        </p>
                        <p className="text-gray-700 text-sm ml-3">
                          @{displayKey(publicKey!)}
                        </p>
                      </div>
                    </div>
                    {!!user && <EditProfile name={user.name} />}
                  </>
                ) : (
                  <Button
                    loading={connecting}
                    className="w-full"
                    onClick={onConnect}
                  >
                    Connect to Wallet
                  </Button>
                )}
              </div>
            </div>
          </div>
        </aside>
        <aside className="flex-5 pt-6">
          <div className="px-8">
            <PostForm
              postTitle={postTitle}
              postContent={postContent}
              setPostTitle={setPostTitle}
              setPostContent={setPostContent}
              onSubmit={() => onCreatePost(postTitle, postContent)}
            />
            {posts.map(({ title, content, userId, id, prePostId }, i) => {
              return (
                <PostCard
                  key={id}
                  id={id}
                  title={title}
                  content={content}
                  user={userId}
                  prePostId={prePostId}
                  nextPostId={posts[i - 1]?.id}
                  date="Dec 2, 2021"
                />
              );
            })}
          </div>
        </aside>
        <aside className="flex-3 pt-6">
          <div className="px-8 dashboard-aside">
            <h2 className="font-bold text-gray-500">Sponsored</h2>
            <SponsoredSkeleton />
            <SponsoredSkeleton />
            <div className="flex justify-end mt-auto">
              <p className="text-sm">© 2021 BloG, Inc.</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
