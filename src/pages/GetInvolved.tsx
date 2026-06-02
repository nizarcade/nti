import Seo from "@/components/ui/Seo";
import GetInvolvedView from "@/components/get-involved/GetInvolvedView";
import { useGetInvolvedContent } from "@/hooks/useGetInvolvedContent";

export default function GetInvolved() {
  const { content } = useGetInvolvedContent();
  return (
    <>
      <Seo title={content.seo.title} description={content.seo.description} pathname="/get-involved" />
      <GetInvolvedView content={content} />
    </>
  );
}
