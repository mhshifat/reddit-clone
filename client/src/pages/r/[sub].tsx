import axios from "axios";
import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  createRef,
  Fragment,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import Sidebar from "../../components/Sidebar";
import { useAuthState } from "../../context/auth";
import { ISub } from "../../types";

const Sub = () => {
  const router = useRouter();
  const [ownSub, setOwnSub] = useState(false);
  const { authenticated, user } = useAuthState();
  const fileInputRef = createRef<HTMLInputElement>();
  const { data: sub, error, revalidate } = useSWR<ISub>(
    router.query.sub ? `/subs/${router.query.sub}` : null
  );

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  const postMarkup = !sub ? (
    <p className="text-lg text-center">Loading...</p>
  ) : sub.posts.length === 0 ? (
    <p className="text-lg text-center">No posts found yet...</p>
  ) : (
    sub.posts.map((post) => <PostCard key={post.identifier} post={post} />)
  );
  const openFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await axios.post(`/subs/${sub.name}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      revalidate();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) router.push("/");
  return (
    <Fragment>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <Fragment>
          <input type="file" hidden ref={fileInputRef} onChange={uploadImage} />
          <div>
            <div
              className={classNames("bg-blue-500", {
                "cursor-pointer": ownSub,
              })}
              onClick={() => openFileInput("banner")}
            >
              {sub.bannerUrl ? (
                <div
                  className="h-56 bg-blue-500"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : (
                <div className="h-20 bg-blue-500" />
              )}
            </div>
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -15 }}>
                  <Image
                    src={sub.imageUrl}
                    alt="Sub"
                    className={classNames("rounded-full", {
                      "cursor-pointer": ownSub,
                    })}
                    width={70}
                    height={70}
                    onClick={() => openFileInput("image")}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-500">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="container flex pt-5">
            <div className="w-160">{postMarkup}</div>
            <Sidebar sub={sub} />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Sub;
