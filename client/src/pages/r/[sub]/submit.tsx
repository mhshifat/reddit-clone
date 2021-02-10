import { route } from "next/dist/next-server/server/router";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import useSWR from "swr";
import Sidebar from "../../../components/Sidebar";
import { ISub, IPost } from "../../../types";
import { FormEvent } from "react";
import axios from "axios";
import { GetServerSideProps } from "next";

const Submit = () => {
  const router = useRouter();
  const { sub: subName } = router.query;
  const { data: sub, error } = useSWR<ISub>(
    subName ? `/subs/${subName}` : null
  );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const submitPost = async (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") return;
    try {
      const { data: post } = await axios.post<IPost>("/posts", {
        title,
        body,
        sub: subName,
      });
      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (error) router.push("/");
  return (
    <Fragment>
      <Head>
        <title>Submit to Reddit</title>
      </Head>
      <div className="container flex pt-5">
        <div className="w-160">
          <div className="p-4 bg-white rounded">
            <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
            <form onSubmit={submitPost}>
              <div className="relative mb-2">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                  maxLength={300}
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div
                  className="absolute mb-2 text-sm text-gray-500 select-none"
                  style={{
                    top: 11,
                    right: 10,
                  }}
                >
                  {title.trim().length}/300
                </div>
              </div>
              <textarea
                value={body}
                placeholder="Text (optional)"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="px-3 py-1 blue button"
                  type="submit"
                  disabled={title.trim() === ""}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        {sub && <Sidebar sub={sub} />}
      </div>
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("Missing auth token cookie");
    await axios.get("/auth/me", { headers: { cookie } });
    return { props: {} };
  } catch (err) {
    res.writeHead(307, { Location: "/login" }).end();
  }
};

export default Submit;
