import { notFound } from "next/navigation";
import { NewsArticle } from "@/components/site/news-article";
import { getNewsPostById } from "@/lib/data/site";
import { pageMetadata } from "@/lib/seo";

interface NewsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NewsPageProps) {
  const { id } = await params;
  const post = await getNewsPostById(id);

  if (!post) {
    return pageMetadata("Nyhet", "Nyhet från il mackeria");
  }

  return pageMetadata(
    post.title_sv,
    post.excerpt_sv ?? post.content_sv.slice(0, 160),
  );
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { id } = await params;
  const post = await getNewsPostById(id);

  if (!post) {
    notFound();
  }

  return <NewsArticle post={post} />;
}
