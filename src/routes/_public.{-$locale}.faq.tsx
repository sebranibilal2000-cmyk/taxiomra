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
      { title: "FAQ — Booking, Pricing & Chauffeur Questions" },
      { name: "description", content: "Answers to common questions about booking, pricing, wait time, and payment." },
      { property: "og:title", content: "FAQ — Sur3a Taxi" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: loaderData ? [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: loaderData.map((f) => ({ "@type": "Question", name: f.question_en, acceptedAnswer: { "@type": "Answer", text: f.answer_en } })),
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
    <section className="container-tight py-16 md:py-24 max-w-3xl">
      <div className="space-y-5 mb-12">
        <span className="eyebrow"><span className="h-px w-8 bg-gold" />FAQ</span>
        <h1 className="font-display text-5xl md:text-6xl leading-tight">{ar ? "أسئلة متكررة" : "Common questions"}</h1>
        <p className="text-lg text-muted-foreground">{ar ? "كل ما تحتاج معرفته قبل الحجز." : "Everything you need to know before booking."}</p>
      </div>
      <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card divide-y divide-border">
        {data.map((f) => (
          <AccordionItem key={f.id} value={f.id} className="border-b-0 px-6">
            <AccordionTrigger className="text-start font-medium text-base py-5">{ar ? f.question_ar : f.question_en}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{ar ? f.answer_ar : f.answer_en}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
