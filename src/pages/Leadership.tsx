import Seo from "@/components/ui/Seo";
import LeadershipView from "@/components/leadership/LeadershipView";
import { useLeadershipContent } from "@/hooks/useLeadershipContent";

export default function Leadership() {
  const { content } = useLeadershipContent();
  return (
    <>
      <Seo
        title={content.seo.title}
        description={content.seo.description}
        pathname="/about/leadership"
      />
      <LeadershipView content={content} />
    </>
  );
}
