import Seo from "@/components/ui/Seo";
import ProgramsView from "@/components/programs/ProgramsView";
import { useProgramsContent } from "@/hooks/useProgramsContent";

export default function Programs() {
  const { content } = useProgramsContent();
  return (
    <>
      <Seo
        title={content.seo.title}
        description={content.seo.description}
        pathname="/programs"
      />
      <ProgramsView content={content} />
    </>
  );
}
