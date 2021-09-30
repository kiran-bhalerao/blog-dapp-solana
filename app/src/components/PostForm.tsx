import { FC, ReactNode, useState } from "react";
import { Button } from "src/components/Button";
import { useBlog } from "src/context/Blog";

interface PostFormProps {
  postTitle: string;
  postContent: string;
  buttonText?: string;
  formHeader?: ReactNode;
  setPostTitle(title: string): void;
  setPostContent(content: string): void;
  onSubmit(): Promise<void>;
}

export const PostForm: FC<PostFormProps> = (props) => {
  const { user } = useBlog();
  const {
    onSubmit,
    postTitle,
    postContent,
    setPostContent,
    setPostTitle,
    formHeader,
    buttonText = "Post",
  } = props;
  const [loading, setLoading] = useState(false);

  return (
    <div className="glass rounded-lg py-4 px-6 bg-white flex flex-col shadow">
      {formHeader}
      <input
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        type="text"
        placeholder="Post title"
        className="bg-white rounded-3xl h-10 px-4"
      />
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        name="content"
        id="content-area"
        rows={3}
        placeholder="Describe your post..."
        className="bg-white rounded-xl px-4 py-2 mt-3"
      ></textarea>
      <Button
        className="mt-3"
        disabled={!user}
        loading={loading}
        onClick={async () => {
          setLoading(true);
          await onSubmit();
          setLoading(false);
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
};
