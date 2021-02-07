import axios from "axios";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React from "react";
import { IPost } from "../types";

dayjs.extend(relativeTime);

interface Props {
	post: IPost;
}

const ActionButton: React.FC = ({ children }) => {
	return (
		<div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
			{children}
		</div>
	);
};

const PostCard: React.FC<Props> = ({ post }) => {
	const vote = async (value: number) => {
		try {
			const res = await axios.post("/misc/vote", {
				identifier: post.identifier,
				slug: post.slug,
				value,
			});
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="flex mb-4 bg-white rounded">
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
					<Link href={`/r/${post.subName}`}>
						<img
							src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
							alt=""
							className="w-6 h-6 mr-1 rounded-full cursor-pointer"
						/>
					</Link>
					<Link href={`/r/${post.subName}`}>
						<a className="text-xs font-bold cursor-pointer hover:underline">
							/r/{post.subName}
						</a>
					</Link>

					<p className="text-xs text-gray-500">
						<span className="mx-1">•</span>
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
