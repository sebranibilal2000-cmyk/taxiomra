import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listFaqs } from "@/lib/public.functions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

const opts = () => queryOptions({ queryKey: ["public", "faqs"], queryFn: () => listFaqs() });

export const Route = createFileRoute("/_public/faq")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts()),
  head: ({ loaderData }) => ({
    meta: [
      { title: "FAQ — Taxi Booking Questions Answered" },
      { name: "description", content: "Answers to common taxi booking questions: how to book, payment methods, pricing, availability." },
      { property: "og:title", content: "FAQ — Sur3a Taxi" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: loaderData ? [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: loaderData.map((f) => ({
          "@type": "Question",
          name: f.question_en,
          acceptedAnswer: { "@type": "Answer", text: f.answer_en },
        })),
      }),
    }] : undefined,
  }),
  component: FAQ,
});

function FAQ() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const { data } = useSuspenseQuery(opts());
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{ar ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</h1>
        <p className="text-muted-foreground">{ar ? "إجابات على أكثر الأسئلة شيوعاً" : "Answers to the most common questions"}</p>
      </div>
      <Accordion type="single" collapsible className="bg-card rounded-xl border">
        {data.map((f) => (
          <AccordionItem key={f.id} value={f.id} className="px-4">
            <AccordionTrigger className="text-start">{ar ? f.question_ar : f.question_en}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{ar ? f.answer_ar : f.answer_en}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
