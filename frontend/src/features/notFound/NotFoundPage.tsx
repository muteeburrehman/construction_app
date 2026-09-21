import React from "react"
import { Link } from "react-router-dom"
import { PageShell } from "@/components/PageShell"
import { Container, Section } from "@/components/ui/layout"
import { Display, Lead, Prose } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function NotFoundPage(): React.JSX.Element {
  return (
    <PageShell
      seo={{
        title: "Page Not Found | Apex Construction Group",
        description: "The page you requested could not be found.",
      }}
    >
      <Section spacing="loose" className="text-center">
        <Container size="narrow">
          <div className="space-y-6">
            <span className="font-mono text-sm uppercase tracking-widest text-slate dark:text-stone/70">
              Error 404
            </span>
            <Display as="h1" size="xl">
              Page not found.
            </Display>
            <Lead className="mx-auto text-slate dark:text-stone/80">
              The page you are looking for has been moved, renamed, or does not exist.
            </Lead>
            <Prose className="mx-auto text-sm text-slate dark:text-stone/70">
              Use the navigation above to explore our custom residential, commercial, and portfolio sections.
            </Prose>
            <div className="pt-6 flex justify-center gap-4">
              <Button asChild variant="default">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Return to Home</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  )
}
