import { notFound } from "next/navigation";
import { NewsArticle } from "@/components/site/news-article";
import { getNewsPostById } from "@/lib/data/site";
import { pageMetadataEn } from "@/lib/seo";

interface NewsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NewsPageProps) {
  const { id } = await params;
  const post = await getNewsPostById(id);

  if (!post) {
    return pageMetadataEn("News", "News from il mackeria");
  }

  const title =
    post.title_en ?? post.title_sv;
  const description =
    post.excerpt_en ?? post.excerpt_sv ?? post.content_sv.slice(0, 160);

  return pageMetadataEn(title, description);
}

export default async function EnglishNewsPage({ params }: NewsPageProps) {
  const { id } = await params;
  const post = await getNewsPostById(id);

  if (!post) {
    notFound();
  }

  return <NewsArticle post={post} locale="en" />;
}
