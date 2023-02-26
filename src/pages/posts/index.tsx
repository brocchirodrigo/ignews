import Head from "next/head";
import Link from "next/link";

import styles from "./styles.module.scss";
import { GetStaticProps } from "next";
import { getPrismicClient } from "../../services/prismic";

// import { RichText } from "prismic-dom";

interface IContentExcerpt {
  type: string;
  text?: string;
  spans?: Array<{ [key: string]: string }> | string;
}

interface IResponsePosts {
  slug: string;
  title: string;
  updatedAt: string;
  excerpt: string;
}

interface PostProps {
  posts: Array<IResponsePosts>;
}

export default function Post({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.getAllByType("publication");

  const posts = response.map((post) => {
    return {
      slug: post.uid,
      title: post.data.title,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
      excerpt:
        post.data.content.find(
          (c: IContentExcerpt) => c.type === "paragraph" && c.text !== ""
        )?.text ?? "",
    };
  });

  return {
    props: {
      posts,
    },
  };
};
