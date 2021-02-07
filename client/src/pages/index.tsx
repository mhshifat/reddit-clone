import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import { Fragment } from "react";
import useSWR from "swr";
import PostCard from "../components/PostCard";

dayjs.extend(relativeTime);

const Home = () => {
	const { data: posts = [] } = useSWR("/posts");

	return (
		<Fragment>
			<Head>
				<title>reddit: the front page of the internet</title>
			</Head>

			<div className="container flex pt-4">
				<div className="w-160">
					{posts?.map((post) => (
						<PostCard key={post.identifier} post={post} />
					))}
				</div>
			</div>
		</Fragment>
	);
};

export default Home;
