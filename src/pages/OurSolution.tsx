import Seo from "@/components/ui/Seo";
import OurSolutionView from "@/components/our-solution/OurSolutionView";
import { useOurSolutionContent } from "@/hooks/useOurSolutionContent";

export default function OurSolution() {
  const { content } = useOurSolutionContent();
  return (
    <>
      <Seo title={content.seo.title} description={content.seo.description} pathname="/programs/grace-bridge/solution" />
      <OurSolutionView content={content} />
    </>
  );
}
