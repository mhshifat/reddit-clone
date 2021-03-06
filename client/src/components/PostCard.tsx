import axios from "axios";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React, { Fragment } from "react";
import { IPost } from "../types";
import ActionButton from "./ActionButton";
import { useAuthState } from "../context/auth";
import { useRouter } from "next/router";
import { route } from "next/dist/next-server/server/router";

dayjs.extend(relativeTime);

interface Props {
  post: IPost;
  revalidate?: Function;
}

const PostCard: React.FC<Props> = ({ post, revalidate }) => {
  const router = useRouter();
  const { authenticated } = useAuthState();

  const isInSubPage = router.pathname === "/r/[sub]";
  const vote = async (value: number) => {
    if (!authenticated) router.push("/login");
    if (value === post.userVote) value = 0;
    try {
      const res = await axios.post("/misc/vote", {
        identifier: post.identifier,
        slug: post.slug,
        value,
      });
      if (revalidate) revalidate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id={post.identifier} className="flex mb-4 bg-white rounded">
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        <div
          onClick={() => vote(1)}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
        >
          <i
            className={classNames("icon-arrow-up", {
              "text-red-500": post.userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{post.voteScore}</p>
        <div
          onClick={() => vote(-1)}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
        >
          <i
            className={classNames("icon-arrow-down", {
              "text-blue-600": post.userVote === -1,
            })}
          ></i>
        </div>
      </div>

      <div className="w-full p-2">
        <div className="flex items-center">
          {!isInSubPage && (
            <Fragment>
              <Link href={`/r/${post.subName}`}>
                <img
                  src={post.sub.imageUrl}
                  alt=""
                  className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                />
              </Link>
              <Link href={`/r/${post.subName}`}>
                <a className="text-xs font-bold cursor-pointer hover:underline">
                  /r/{post.subName}
                </a>
              </Link>
            </Fragment>
          )}

          <p className="text-xs text-gray-500">
            Posted By
            <Link href={`/u/${post.username}`}>
              <a className="mx-1 hover:underline">/u/{post.username}</a>
            </Link>
            <Link href={post.url}>
              <a className="mx-1 hover:underline">
                {dayjs(post.createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>

        <Link href={post.url}>
          <a className="my-1 text-lg font-medium">{post.title}</a>
        </Link>
        {post.body && <p className="my-1 text-sm">{post.body}</p>}

        <div className="flex">
          <Link href={post.url}>
            <a className="flex">
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{post.commentCount} Comments</span>
              </ActionButton>
              <ActionButton>
                <i className="mr-1 fas fa-share fa-xs"></i>
                <span className="font-bold">Share</span>
              </ActionButton>
              <ActionButton>
                <i className="mr-1 fas fa-bookmark fa-xs"></i>
                <span className="font-bold">Save</span>
              </ActionButton>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
