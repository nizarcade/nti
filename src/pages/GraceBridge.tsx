import Seo from "@/components/ui/Seo";
import GraceBridgeView from "@/components/grace-bridge/GraceBridgeView";
import { useGraceBridgeContent } from "@/hooks/useGraceBridgeContent";

export default function GraceBridge() {
  const { content } = useGraceBridgeContent();
  return (
    <>
      <Seo title={content.seo.title} description={content.seo.description} pathname="/programs/grace-bridge" />
      <GraceBridgeView content={content} />
    </>
  );
}
