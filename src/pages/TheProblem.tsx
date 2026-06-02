import Seo from "@/components/ui/Seo";
import TheProblemView from "@/components/the-problem/TheProblemView";
import { useTheProblemContent } from "@/hooks/useTheProblemContent";

export default function TheProblem() {
  const { content } = useTheProblemContent();
  return (
    <>
      <Seo title={content.seo.title} description={content.seo.description} pathname="/programs/grace-bridge/problem" />
      <TheProblemView content={content} />
    </>
  );
}
