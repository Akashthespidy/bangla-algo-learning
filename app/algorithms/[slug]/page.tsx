import { getAlgorithm, getAllAlgorithms } from "@/lib/algorithms";
import { notFound } from "next/navigation";
import AlgorithmPageClient from "@/components/AlgorithmPageClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const algorithms = getAllAlgorithms();
  return algorithms.map((algo) => ({
    slug: algo.slug,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const algorithm = await getAlgorithm(params.slug);
  
  if (!algorithm) {
    return {
      title: "অ্যালগরিদম পাওয়া যায়নি",
    };
  }

  return {
    title: `${algorithm.nameBn} (${algorithm.name}) | এসো অ্যালগরিদম শিখি`,
    description: algorithm.description,
  };
}

export default async function AlgorithmPage(props: PageProps) {
  const params = await props.params;
  const algorithm = await getAlgorithm(params.slug);

  if (!algorithm) {
    notFound();
  }

  return <AlgorithmPageClient algorithm={algorithm} />;
}
