import Seo from "@/components/ui/Seo";
import BooksView from "@/components/books/BooksView";
import { useBooksContent } from "@/hooks/useBooksContent";

export default function Books() {
  const { content } = useBooksContent();
  return (
    <>
      <Seo
        title={content.seo.title}
        description={content.seo.description}
        pathname="/about/books"
      />
      <BooksView content={content} />
    </>
  );
}
