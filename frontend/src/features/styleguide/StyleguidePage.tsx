import React, { useState } from "react"
import { PageShell } from "@/components/PageShell"
import { Container, Grid } from "@/components/ui/layout"
import { Display, Heading, Lead, Prose } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowRight, CheckCircle2, Moon, Sun } from "lucide-react"

const COLOR_TOKENS = [
  {
    name: "ink",
    hex: "#121713",
    variable: "--color-ink",
    role: "Deep green-black • Dominant dark background, primary type on bone",
    bgClass: "bg-ink text-bone",
    borderClass: "border-ink-2",
  },
  {
    name: "ink-2",
    hex: "#1C231C",
    variable: "--color-ink-2",
    role: "Secondary dark • Card surfaces in dark mode, footer background, dividers",
    bgClass: "bg-ink-2 text-bone",
    borderClass: "border-ink-2",
  },
  {
    name: "bone",
    hex: "#EFEBE2",
    variable: "--color-bone",
    role: "Warm paper • Primary light background, high-contrast type on ink",
    bgClass: "bg-bone text-ink border border-stone",
    borderClass: "border-stone",
  },
  {
    name: "stone",
    hex: "#DCD7CB",
    variable: "--color-stone",
    role: "Limestone • Neutral secondary background, borders, subtle callout cards",
    bgClass: "bg-stone text-ink",
    borderClass: "border-stone",
  },
  {
    name: "vine",
    hex: "#3F5140",
    variable: "--color-vine",
    role: "Vineyard green • Brand grounding, secondary accents, environmental tone",
    bgClass: "bg-vine text-bone",
    borderClass: "border-vine",
  },
  {
    name: "cab",
    hex: "#6B2231",
    variable: "--color-cab",
    role: "Cabernet • High-intent CTA accent, rule lines, focus indicators (used sparingly)",
    bgClass: "bg-cab text-bone",
    borderClass: "border-cab",
  },
  {
    name: "slate",
    hex: "#6E7169",
    variable: "--color-slate",
    role: "Warm slate • Secondary text, captions, metadata, subdued borders",
    bgClass: "bg-slate text-bone",
    borderClass: "border-slate",
  },
]

export function StyleguidePage(): React.JSX.Element {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    const root = document.documentElement
    if (isDark) {
      root.classList.remove("dark")
      setIsDark(false)
    } else {
      root.classList.add("dark")
      setIsDark(true)
    }
  }

  return (
    <PageShell
      seo={{
        title: "Design System & Styleguide (Internal)",
        description: "Design tokens, typography scale, and primitives for Apex Construction Group.",
      }}
    >
      {/* Header Band */}
      <div className="border-b border-stone/50 dark:border-ink-2 bg-stone/20 dark:bg-ink-2/40 py-12">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 text-xs font-display uppercase tracking-wider text-slate dark:text-stone/70 mb-2">
                <span>Internal System Reference</span>
                <span>•</span>
                <span>Demo v1</span>
              </div>
              <Display as="h1" size="xl">
                Brand & Design System
              </Display>
              <Lead className="mt-2 text-base sm:text-lg">
                Apex Construction Group • California General Contractor (Est. 1998, CSLB Lic. #849201)
              </Lead>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="default"
              className="self-start sm:self-center flex items-center gap-2"
              aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
            >
              {isDark ? <Sun className="h-4 w-4 text-stone" /> : <Moon className="h-4 w-4 text-ink" />}
              <span>{isDark ? "View Light Theme" : "View Dark Theme"}</span>
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-16 space-y-24">
        {/* Section 1: Color Tokens */}
        <section id="tokens" className="space-y-8">
          <div className="border-b border-stone dark:border-ink-2 pb-4">
            <Heading level={2}>1. Color Tokens</Heading>
            <Prose className="mt-2 text-slate dark:text-stone/80">
              Confident and quiet palette reflecting stone, steel, glass, vineyard green, and deep cabernet.
            </Prose>
          </div>

          <Grid cols={3} gap="md">
            {COLOR_TOKENS.map((token) => (
              <div
                key={token.name}
                className="flex flex-col rounded-sm overflow-hidden border border-stone/60 dark:border-ink-2 bg-bone/60 dark:bg-ink-2/30"
              >
                <div
                  className={`h-24 p-4 flex items-end justify-between font-display font-semibold text-sm ${token.bgClass}`}
                >
                  <span className="uppercase tracking-wide">{token.name}</span>
                  <span className="font-mono text-xs">{token.hex}</span>
                </div>
                <div className="p-4 space-y-1.5 text-xs font-body">
                  <div className="font-mono text-slate dark:text-stone/60">{token.variable}</div>
                  <div className="text-ink/80 dark:text-bone/80 font-normal leading-relaxed">
                    {token.role}
                  </div>
                </div>
              </div>
            ))}
          </Grid>
        </section>

        {/* Section 2: Typography Scale */}
        <section id="typography" className="space-y-8">
          <div className="border-b border-stone dark:border-ink-2 pb-4">
            <Heading level={2}>2. Typography Primitives & Modular Scale</Heading>
            <Prose className="mt-2 text-slate dark:text-stone/80">
              Display face is self-hosted <strong>Archivo</strong> (600/800, tight negative tracking). Body face is self-hosted <strong>Source Serif 4</strong> (400/600, body measure strictly constrained to max 68ch).
            </Prose>
          </div>

          <div className="space-y-10 rounded-sm border border-stone/60 dark:border-ink-2 p-8 bg-bone/40 dark:bg-ink-2/20">
            {/* Display */}
            <div className="space-y-3 pb-8 border-b border-stone/40 dark:border-ink-2">
              <span className="text-xs font-display text-slate uppercase tracking-wider">
                &lt;Display size="2xl" /&gt; — Archivo 800
              </span>
              <Display size="2xl">Building in the Napa Valley since 1979.</Display>
            </div>

            <div className="space-y-3 pb-8 border-b border-stone/40 dark:border-ink-2">
              <span className="text-xs font-display text-slate uppercase tracking-wider">
                &lt;Display size="xl" /&gt; — Archivo 800
              </span>
              <Display size="xl">Custom residential & commercial execution.</Display>
            </div>

            {/* Headings */}
            <div className="space-y-6 pb-8 border-b border-stone/40 dark:border-ink-2">
              <span className="text-xs font-display text-slate uppercase tracking-wider">
                &lt;Heading level=&#123;1..4&#125; /&gt;
              </span>
              <Heading level={1}>Heading 1 — Silverado Trail Estate</Heading>
              <Heading level={2}>Heading 2 — Architectural Millwork & Framing</Heading>
              <Heading level={3}>Heading 3 — Time and Materials Billing Transparency</Heading>
              <Heading level={4}>Heading 4 — St. Helena Private Cellar & Tasting Room</Heading>
            </div>

            {/* Lead & Prose */}
            <div className="space-y-4">
              <span className="text-xs font-display text-slate uppercase tracking-wider">
                &lt;Lead&gt; and &lt;Prose&gt; (Source Serif 4, 68ch measure)
              </span>
              <Lead>
                Every project is run directly by the people who will be on your job site every morning. No multi-layer brokerage, no handoffs to unvetted subcontractors.
              </Lead>
              <Prose>
                We build for clients who care about structural permanence and meticulous detailing. From ground-up vineyard estates to commercial winery hospitality pavilions, our crew has maintained continuous CSLB licensing in good standing for over four decades.
              </Prose>
            </div>
          </div>
        </section>

        {/* Section 3: Layout Primitives */}
        <section id="layout" className="space-y-8">
          <div className="border-b border-stone dark:border-ink-2 pb-4">
            <Heading level={2}>3. Layout Primitives</Heading>
            <Prose className="mt-2 text-slate dark:text-stone/80">
              Structured with &lt;Container&gt; (max-w 1180px), &lt;Section&gt; (predictable vertical rhythm, no conflicting margin hacks), and responsive &lt;Grid&gt;.
            </Prose>
          </div>

          <div className="space-y-6">
            <div className="p-6 border border-stone dark:border-ink-2 rounded-sm bg-stone/20 dark:bg-ink-2/40">
              <span className="text-xs font-display font-semibold uppercase text-slate">
                &lt;Grid cols=&#123;3&#125;&gt; with definition list card pattern
              </span>
              <Grid cols={3} gap="md" className="mt-4">
                <div className="p-5 border border-stone dark:border-ink-2 bg-bone dark:bg-ink rounded-xs">
                  <span className="text-xs font-display text-slate uppercase">Credential</span>
                  <div className="font-display font-bold text-lg text-ink dark:text-bone mt-1">CSLB Lic. #849201</div>
                  <p className="text-xs font-body text-slate mt-2">Class B General Building Contractor in continuous standing since 1998.</p>
                </div>
                <div className="p-5 border border-stone dark:border-ink-2 bg-bone dark:bg-ink rounded-xs">
                  <span className="text-xs font-display text-slate uppercase">Billing Method</span>
                  <div className="font-display font-bold text-lg text-ink dark:text-bone mt-1">Time & Materials</div>
                  <p className="text-xs font-body text-slate mt-2">Open-book actual costs with zero hidden markup surprises.</p>
                </div>
                <div className="p-5 border border-stone dark:border-ink-2 bg-bone dark:bg-ink rounded-xs">
                  <span className="text-xs font-display text-slate uppercase">Service Territory</span>
                  <div className="font-display font-bold text-lg text-ink dark:text-bone mt-1">Napa & Sonoma</div>
                  <p className="text-xs font-body text-slate mt-2">Yountville, St. Helena, Calistoga, Rutherford, and Napa Valley.</p>
                </div>
              </Grid>
            </div>
          </div>
        </section>

        {/* Section 4: Interactive Components */}
        <section id="components" className="space-y-8">
          <div className="border-b border-stone dark:border-ink-2 pb-4">
            <Heading level={2}>4. Component States & Forms</Heading>
            <Prose className="mt-2 text-slate dark:text-stone/80">
              All interactive elements have high-visibility :focus-visible rings and restrained micro-interactions.
            </Prose>
          </div>

          <div className="space-y-10">
            {/* Buttons */}
            <div className="space-y-4">
              <Heading level={3}>Buttons</Heading>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="default">
                  <span>Request an estimate</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="charcoal">Charcoal Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="light-outline">Light-Outline Button</Button>
                <Button variant="default" disabled>Disabled State</Button>
              </div>
            </div>

            {/* Inputs & Select */}
            <div className="space-y-4">
              <Heading level={3}>Form Primitives</Heading>
              <Grid cols={3} gap="md">
                <div className="space-y-2">
                  <label htmlFor="sample-name" className="text-xs font-display font-medium text-ink dark:text-bone">
                    Your Name
                  </label>
                  <Input id="sample-name" placeholder="e.g. Eleanor Vance" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="sample-email" className="text-xs font-display font-medium text-ink dark:text-bone">
                    Email Address
                  </label>
                  <Input id="sample-email" type="email" placeholder="eleanor@example.com" />
                </div>

                <div className="space-y-2">
                  <label id="project-type-label" className="text-xs font-display font-medium text-ink dark:text-bone">
                    Project Type
                  </label>
                  <Select defaultValue="residential">
                    <SelectTrigger aria-labelledby="project-type-label">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Custom Residential Build</SelectItem>
                      <SelectItem value="remodel">Estate Remodel & Addition</SelectItem>
                      <SelectItem value="commercial">Commercial / Winery Facility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Grid>

              <div className="space-y-2 max-w-2xl mt-4">
                <label htmlFor="sample-message" className="text-xs font-display font-medium text-ink dark:text-bone">
                  Project Notes & Timeline
                </label>
                <Textarea id="sample-message" placeholder="Describe the scope, site location, and anticipated schedule..." />
              </div>
            </div>

            {/* Accordion & Modal */}
            <div className="space-y-4">
              <Heading level={3}>Overlays & Disclosures</Heading>
              <div className="flex flex-wrap items-center gap-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Preview Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Transparent Estimates</DialogTitle>
                      <DialogDescription>
                        Every project begins with an on-site interview and trade walk to produce realistic allowances for Napa Valley conditions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2 text-sm font-body">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cab" />
                        <span>Direct builder oversight on all framing and finishes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cab" />
                        <span>Complete itemized trade breakdown before breaking ground</span>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="max-w-2xl mt-4">
                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How does time and materials billing protect the client?</AccordionTrigger>
                    <AccordionContent>
                      Unlike fixed-bid contracts where contractors inflate contingency margins or cut corners on concealed structural details to preserve profit, time and materials provides direct access to all vendor invoices and subcontractor billings with a fixed overhead fee.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Do you handle city and county permit submissions?</AccordionTrigger>
                    <AccordionContent>
                      Yes. We work closely with local building departments in Napa, Sonoma, St. Helena, and Yountville to navigate planning, seismic, and wildland-urban interface (WUI) compliance.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </PageShell>
  )
}
