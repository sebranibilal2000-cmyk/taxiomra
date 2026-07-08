import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, ShieldCheck, Wallet, Star, ArrowLeft, Phone } from "lucide-react";
import heroImage from "@/assets/taxi-hero.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-2 font-black text-xl tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              س
            </span>
            سُرعة
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition">المميزات</a>
            <a href="#how" className="hover:text-foreground transition">كيف يعمل</a>
            <a href="#pricing" className="hover:text-foreground transition">الأسعار</a>
            <a href="#faq" className="hover:text-foreground transition">الأسئلة</a>
          </nav>
          <a
            href="#download"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            حمّل التطبيق
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              متوفر الآن في مدينتك
            </span>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight md:text-6xl">
              احجز تاكسيك
              <br />
              في <span className="relative inline-block">
                <span className="relative z-10">ثوانٍ معدودة.</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-accent/70" />
              </span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              منصة سُرعة تربطك بأقرب سائق موثوق بضغطة واحدة. أسعار واضحة قبل الانطلاق،
              ودعم على مدار الساعة، وتجربة بسيطة تليق بك.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#download"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:translate-y-[-1px]"
              >
                ابدأ الحجز الآن
                <ArrowLeft className="h-4 w-4" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground transition hover:bg-secondary"
              >
                كيف يعمل التطبيق؟
              </a>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2 space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-accent to-primary"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="text-muted-foreground">
                  <span className="font-bold text-foreground">+٥٠٬٠٠٠</span> راكب سعيد
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tl from-accent/30 via-transparent to-primary/10 blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/10">
              <img
                src={heroImage}
                alt="سيارة أجرة صفراء في المدينة"
                width={1600}
                height={1200}
                className="h-auto w-full"
              />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -right-4 w-64 rounded-2xl border border-border bg-card p-4 shadow-xl md:-right-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-accent-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">السائق في الطريق</div>
                  <div className="text-sm font-bold">يصل خلال ٣ دقائق</div>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-3/4 rounded-full bg-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-14 max-w-2xl">
            <div className="mb-3 text-sm font-bold text-accent-foreground/70">لماذا سُرعة</div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              كل ما تحتاجه لرحلة مريحة وآمنة
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "وصول سريع",
                desc: "متوسط زمن وصول أقل من ٥ دقائق في معظم المناطق.",
              },
              {
                icon: ShieldCheck,
                title: "سائقون موثوقون",
                desc: "جميع السائقين موثّقون ومدرَّبون لضمان أمانك وراحتك.",
              },
              {
                icon: Wallet,
                title: "أسعار شفافة",
                desc: "اعرف تكلفة رحلتك قبل الانطلاق. لا مفاجآت ولا رسوم خفية.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground transition group-hover:bg-accent group-hover:text-accent-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-14 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="mb-3 text-sm font-bold text-accent-foreground/70">خطوات بسيطة</div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                ثلاث خطوات وأنت في الطريق
              </h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "١", t: "حدد وجهتك", d: "أدخل موقعك ووجهتك على الخريطة بسهولة." },
              { n: "٢", t: "اختر سيارتك", d: "اطّلع على السعر واختر نوع الرحلة المناسب." },
              { n: "٣", t: "استمتع بالرحلة", d: "تابع السائق مباشرة وادفع بالطريقة التي تفضّلها." },
            ].map((s) => (
              <div key={s.n} className="relative rounded-3xl border border-border bg-card p-8">
                <div className="mb-6 text-6xl font-black text-accent">{s.n}</div>
                <h3 className="mb-2 text-lg font-bold">{s.t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="download"
        className="mx-4 my-16 overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground md:mx-auto md:max-w-6xl"
      >
        <div className="grid gap-8 p-10 md:grid-cols-[1.3fr_1fr] md:p-16">
          <div>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              جاهز لتجربة تنقل
              <br />
              <span className="text-accent">أذكى وأسرع؟</span>
            </h2>
            <p className="mt-4 max-w-md text-primary-foreground/70">
              حمّل تطبيق سُرعة الآن وانضم إلى آلاف الركاب الذين اختاروا الراحة.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#" className="rounded-2xl bg-background/10 px-6 py-4 text-sm font-bold ring-1 ring-white/15 hover:bg-background/15">
                App Store
              </a>
              <a href="#" className="rounded-2xl bg-accent px-6 py-4 text-sm font-bold text-accent-foreground hover:opacity-90">
                Google Play
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-center">
              <Phone className="mx-auto mb-3 h-8 w-8 text-accent" />
              <div className="text-sm text-primary-foreground/70">اتصل بنا مباشرة</div>
              <div className="mt-1 text-2xl font-black tracking-wider">١٩٠٠٠</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} سُرعة. جميع الحقوق محفوظة.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">الخصوصية</a>
            <a href="#" className="hover:text-foreground">الشروط</a>
            <a href="#" className="hover:text-foreground">تواصل معنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
