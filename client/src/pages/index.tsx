import dayjs from "dayjs";
import { name } from "dayjs/locale/*";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import useSWR from "swr";
import PostCard from "../components/PostCard";
import { ISub } from "../types";

dayjs.extend(relativeTime);

const Home = () => {
  const { data: posts = [] } = useSWR("/posts");
  const { data: subs = [] } = useSWR("/misc/top-subs");

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

        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {subs?.map((sub: ISub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <div className="mr-2 overflow-hidden rounded-full cursor-pointer">
                    <Link href={`/r/${sub.name}`}>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                    </Link>
                  </div>
                  <Link href={`/r/${sub.name}`}>
                    <a className="font-bold cursor-pointer">/r/{sub.name}</a>
                  </Link>
                  <p className="ml-auto font-medium">{sub.postCount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;