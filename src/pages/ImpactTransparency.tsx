import Seo from "@/components/ui/Seo";
import ImpactView from "@/components/impact/ImpactView";
import { useImpactContent } from "@/hooks/useImpactContent";

export default function ImpactTransparency() {
  const { content } = useImpactContent();
  return (
    <>
      <Seo title={content.seo.title} description={content.seo.description} pathname="/impact" />
      <ImpactView content={content} />
    </>
  );
}
