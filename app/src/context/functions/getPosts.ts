import { Program } from "@project-serum/anchor";
import { Observable, Subscriber } from "rxjs";
import { Post } from "src/context/Blog";
import { getPostById } from "src/context/functions/getPostById";

export function getPosts(args: {
  program: Program;
  fromPostId: string;
  toPostId?: string;
}) {
  let sub: Subscriber<Post> | undefined;

  const cancel = () => sub?.unsubscribe();
  const observer = new Observable<Post>((subscriber) => {
    sub = subscriber;

    async function start() {
      const { program, fromPostId } = args;
      let nextPostId: string | null = fromPostId;

      while (!!nextPostId) {
        const post: Post | undefined = await getPostById(nextPostId, program);
        if (!post) {
          break;
        }

        subscriber.next(post);
        nextPostId = post.prePostId;
      }

      subscriber.complete();
    }

    start();
  });

  return [observer, cancel] as const;
}
