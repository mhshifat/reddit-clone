import dayjs from "dayjs";
import { name } from "dayjs/locale/*";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import useSWR, { useSWRInfinite } from "swr";
import PostCard from "../components/PostCard";
import { ISub, IPost } from "../types";
import { useAuthState } from "../context/auth";

dayjs.extend(relativeTime);

const title = "reddit: the front page of the internet";
const description =
  "Reddit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!";
const Home = () => {
  const { authenticated } = useAuthState();
  const { data: subs = [] } = useSWR("/misc/top-subs");
  const [observedPost, setObservedPost] = useState("");
  const {
    data,
    error,
    size: page,
    setSize: setPage,
    revalidate,
  } = useSWRInfinite<IPost[]>((index) => `/posts?page=${index}`);

  const posts: IPost[] = data ? [].concat(...data) : [];

  useEffect(() => {
    if (!posts || posts.length === 0) return;
    const id = posts[posts.length - 1].identifier;
    if (id !== observedPost) {
      setObservedPost(id);
      observeEl(document.getElementById(id));
    }
  }, [posts]);

  const isInitialLoading = !data && !error;
  const observeEl = (el: HTMLElement) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          setPage(page + 1);
          observer.unobserve(el);
        }
      },
      { threshold: 1 }
    );
    observer.observe(el);
  };

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Head>

      <div className="container flex pt-4">
        <div className="w-160">
          {isInitialLoading && (
            <p className="text-lg text-center">Loading...</p>
          )}
          {posts?.map((post) => (
            <PostCard
              key={post.identifier}
              post={post}
              revalidate={revalidate}
            />
          ))}
          {isInitialLoading && posts.length > 0 && (
            <p className="text-lg text-center">Loading More...</p>
          )}
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
                  <Link href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        className="rounded-full cursor-pointer"
                        src={sub.imageUrl}
                        alt="Sub"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                    </a>
                  </Link>
                  <Link href={`/r/${sub.name}`}>
                    <a className="ml-2 font-bold cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-medium">{sub.postCount}</p>
                </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
