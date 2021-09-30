import { PublicKey } from "@solana/web3.js";
import { FC, useState } from "react";
import { EditPost } from "src/components/EditPost";
import { useBlog } from "src/context/Blog";
import { displayKey } from "src/functions/displayKey";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  user: string;
  date: string;
  prePostId: string | null;
  nextPostId: string | undefined;
}

export const PostCard: FC<PostCardProps> = (props) => {
  const { id, title, content, user, date, nextPostId, prePostId } = props;
  const { user: currentUser, deletePost, deleteLatestPost } = useBlog();

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div className="glass rounded-lg py-4 px-6 bg-white shadow flex flex-col mt-4">
      <h3 className="font-bold text-lg text-gray-600">{title}</h3>
      <p className="my-2">{content}</p>
      <div className="flex justify-between items-end">
        <div className="flex items-center mt-2">
          <img
            src="https://gravatar.com/avatar/0c3178b383820ae4f3f5b230717c4082?s=400&d=robohash&r=x"
            alt="avatar"
            className="w-10 h-10 rounded-full bg-gray-200 shadow ring-2 ring-indigo-400 ring-offset-2 ring-opacity-50"
          />
          <div className="mx-3">
            <h3 className="font-bold text-gray-600 capitalize">
              @{displayKey(new PublicKey(user))}
            </h3>
            <p className="text-xs">{date}</p>
          </div>
        </div>
        {user === currentUser?.id && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-500 transition duration-100 ease-in-out transform hover:scale-110 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => setOpenEdit(true)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <EditPost
              post={{
                title,
                content,
                id,
                userId: user,
                prePostId,
              }}
              open={openEdit}
              setOpen={(o) => setOpenEdit(o)}
            />

            <button
              disabled={loadingDelete}
              className={
                loadingDelete ? "cursor-not-allowed" : "cursor-pointer"
              }
              onClick={async () => {
                setLoadingDelete(true);
                if (nextPostId) {
                  await deletePost(id, nextPostId);
                } else {
                  await deleteLatestPost(id);
                }
                setLoadingDelete(false);
              }}
            >
              {loadingDelete ? (
                <svg
                  className="animate-spin h-5 w-5 text-red-500"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500 transition duration-100 ease-in-out transform hover:scale-110 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
