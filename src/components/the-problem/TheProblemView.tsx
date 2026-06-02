import { Container, Stack, Typography, Card, CardContent } from "@mui/material";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import type { TheProblemContent } from "@/content/theProblemDefaults";

export default function TheProblemView({ content }: { content: TheProblemContent }) {
  const { intro, issues, ctaBand } = content;
  return (
    <>
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading eyebrow={intro.eyebrow} title={intro.title} />
        {issues.enabled && (
          <Stack spacing={3}>
            {issues.items.map((i, idx) => (
              <Card key={`${i.title}-${idx}`}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h4" component="h3">{i.title}</Typography>
                  <Typography sx={{ mt: 1.5, color: "text.secondary" }}>{i.body}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
      {ctaBand.enabled && <CtaBand title={ctaBand.title} body={ctaBand.body ?? undefined} />}
    </>
  );
}
