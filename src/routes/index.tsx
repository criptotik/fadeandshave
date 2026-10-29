import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import hero from "@/assets/hero.jpg";
import yaseen from "@/assets/yaseen.webp.asset.json";
import hasan from "@/assets/hasan.webp.asset.json";
import najem from "@/assets/najem.webp.asset.json";

const BOOK = "https://www.fresha.com/providers/81611";

const services = [
  { name: "Cut", items: [["Fade / Hair Cut", 80], ["Kids Hair Cut", 50]] },
  { name: "Blow Dry", items: [["Short Length", 50], ["Long Length", 100]] },
  { name: "Hair Colouring", items: [["Short Length", 140], ["Medium Length", 180], ["Long Length", 220]] },
  { name: "Keratin", items: [["Short Length", 500], ["Medium Length", 750], ["Long Length", 1000]] },
] as const;

const EMAIL = "info@fadeandshave.ae";
const ALL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SUN_THU = ALL.slice(0, 5);
const FRI_SAT = ["Friday", "Saturday"];
type Hours = { label: string; time: string; days: string[]; opens: string }[];
const weekSplit: Hours = [
  { label: "Sunday – Thursday", time: "10:00 AM – 12:00 AM", days: SUN_THU, opens: "10:00" },
  { label: "Friday & Saturday", time: "9:00 AM – 12:00 AM", days: FRI_SAT, opens: "09:00" },
];
const locations = [
  { name: "Princess Tower, Dubai Marina", street: "Shop No.7, Princess Tower", area: "Dubai Marina", phone: "+971 4 564 8515", hours: weekSplit },
  { name: "The Beach, JBR", street: "Shop 3201A, Meeras", area: "JBR", phone: "+971 4 876 8502", hours: [{ label: "Sunday – Saturday", time: "10:00 AM – 12:00 AM", days: ALL, opens: "10:00" }] as Hours },
  { name: "LIV Residence, Dubai Marina", street: "Shop 3, LIV Residence", area: "Dubai Marina", phone: "+971 4 580 3784", hours: weekSplit },
];
const team = [
  { name: "Yaseen", role: "Manager", img: yaseen.url },
  { name: "Hassan", role: "Branch Co-ordinator", img: hasan.url },
  { name: "Najem", role: "Barber", img: najem.url },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": locations.map((loc) => ({
    "@type": "BarberShop",
    name: `Fade & Shave Barbers – ${loc.name}`,
    url: "https://fadeandshave.ae",
    telephone: loc.phone,
    email: EMAIL,
    priceRange: "AED 50 – AED 1000",
    address: { "@type": "PostalAddress", streetAddress: loc.street, addressLocality: `${loc.area}, Dubai`, addressCountry: "AE" },
    openingHoursSpecification: loc.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: "23:59",
    })),
    potentialAction: { "@type": "ReserveAction", target: BOOK },
    makesOffer: services.flatMap((s) =>
      s.items.map(([n, p]) => ({
        "@type": "Offer",
        priceCurrency: "AED",
        price: p,
        itemOffered: { "@type": "Service", name: `${s.name} – ${n}` },
      })),
    ),
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fade & Shave Barbers | Dubai Marina & JBR Barbershop" },
      {
        name: "description",
        content:
          "Boutique gents barbershop in Dubai Marina and JBR. Fades, haircuts, razor shaves, colouring and keratin from AED 50. Open daily till midnight. Book online.",
      },
      { property: "og:title", content: "Fade & Shave Barbers | Dubai Marina & JBR" },
      {
        property: "og:description",
        content: "Handpicked barbers for fades, shaves and grooming. Open daily till midnight. Book online.",
      },
    ],
    links: [{ rel: "canonical", href: "https://fadeandshave.ae/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Index,
});

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-primary focus:text-primary-foreground">
        Skip to content
      </a>
      <header className="absolute inset-x-0 top-0 z-10">
        <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <a href="/" className="font-display text-xl text-foreground">Fade &amp; Shave</a>
          <ul className="hidden gap-7 text-sm md:flex">
            {["services", "locations", "team"].map((s) => (
              <li key={s}><a href={`#${s}`} className="capitalize text-muted-foreground hover:text-primary">{s}</a></li>
            ))}
          </ul>
          <a href={BOOK} className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Book now</a>
        </nav>
      </header>

      <main id="main">
        <section className="relative flex min-h-[88vh] items-center overflow-hidden">
          <img src={hero} alt="Barber giving a skin fade at Fade & Shave, Dubai Marina" width={1280} height={800} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto w-full max-w-6xl px-5">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Dubai Marina · JBR</p>
            <h1 className="mt-4 max-w-2xl text-5xl leading-tight md:text-7xl">Boutique barbers for the sharpest fade in Dubai</h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">Handpicked barbers. Cuts, razor shaves, facials and colouring — open 7 days till midnight.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={BOOK} className="rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">Book an appointment</a>
              <a href="#services" className="rounded-sm border border-border px-6 py-3 font-semibold hover:border-primary">See prices</a>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-5 py-24">
          <h2 className="text-4xl md:text-5xl">Services &amp; prices</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Every service tailored to your hair, skin type and style.</p>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border bg-border md:grid-cols-2">
            {services.map((s) => (
              <article key={s.name} className="bg-card p-8">
                <h3 className="text-2xl text-primary">{s.name}</h3>
                <dl className="mt-5 space-y-3">
                  {s.items.map(([n, p]) => (
                    <div key={n} className="flex items-baseline gap-3">
                      <dt>{n}</dt>
                      <span aria-hidden className="flex-1 border-b border-dotted" />
                      <dd className="font-semibold">AED {p}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section id="locations" className="border-y bg-card">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <h2 className="text-4xl md:text-5xl">Three shops, one standard</h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {locations.map((l) => (
                <li key={l.name} className="rounded-sm border p-6">
                  <h3 className="text-xl">{l.name}</h3>
                  <address className="mt-2 text-sm not-italic text-muted-foreground">
                    {l.street}, {l.area}, Dubai
                    <br />
                    <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="text-foreground hover:text-primary">{l.phone}</a>
                  </address>
                  <dl className="mt-4 space-y-1 text-sm">
                    {l.hours.map((h) => (
                      <div key={h.label} className="flex justify-between gap-3">
                        <dt className="text-muted-foreground">{h.label}</dt>
                        <dd>{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                  <a href={BOOK} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Book at this shop →</a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="team" className="mx-auto max-w-6xl px-5 py-24">
          <h2 className="text-4xl md:text-5xl">Meet the barbers</h2>
          <p className="mt-3 text-muted-foreground">Handpicked experts to elevate your experience at Fade &amp; Shave.</p>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {team.map((t) => (
              <li key={t.name} className="text-center">
                <img src={t.img} alt={`${t.name}, ${t.role} at Fade & Shave`} width={480} height={480} loading="lazy" className="mx-auto aspect-square w-full max-w-xs object-contain object-bottom grayscale" />
                <h3 className="mt-4 text-2xl">{t.name}</h3>
                <p className="text-sm uppercase tracking-widest text-primary">{t.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-16 md:flex-row md:items-center">
            <h2 className="text-3xl md:text-4xl">Ready for a fresh cut?</h2>
            <a href={BOOK} className="rounded-sm bg-background px-6 py-3 font-semibold text-foreground hover:opacity-90">Book on Fresha</a>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Fade &amp; Shave Barbers · Dubai Marina &amp; JBR ·{" "}
        <a href={`mailto:${EMAIL}`} className="hover:text-primary">{EMAIL}</a>
      </footer>
    </div>
  );
}
