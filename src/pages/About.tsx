import Seo from "@/components/ui/Seo";
import AboutView from "@/components/about/AboutView";
import { useAboutContent } from "@/hooks/useAboutContent";

export default function About() {
  const { content } = useAboutContent();
  return (
    <>
      <Seo title={content.seo.title} description={content.seo.description} pathname="/about" />
      <AboutView content={content} />
    </>
  );
}
