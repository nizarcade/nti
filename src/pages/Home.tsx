import Seo from "@/components/ui/Seo";
import HomeView from "@/components/home/HomeView";
import { useHomeContent } from "@/hooks/useHomeContent";

export default function Home() {
  const { content } = useHomeContent();
  return (
    <>
      <Seo
        title={content.seo.title}
        description={content.seo.description}
        pathname="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Northern Transformation Initiative",
          url: "https://ntiafrica.org",
          potentialAction: {
            "@type": "DonateAction",
            target: "https://ntiafrica.org/donate",
          },
        }}
      />
      <HomeView content={content} />
    </>
  );
}
