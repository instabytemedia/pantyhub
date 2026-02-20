import Link from "next/link";
import { ArrowRight, Layers, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold">PantyHub</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold  tracking-tight max-w-3xl mx-auto">
          Buy and Sell with Confidence
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          PantyHub is a used panty marketplace that prioritizes user safety and anonymity, offering a range of features including secure transactions, own shop systems, and human-operated fake checks. The platform incentivizes sellers to use the platform by offering no transaction fees and allowing them to set their own prices. Buyers can browse listings, send messages to sellers, and make purchases with ease.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded bg-primary   text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200 px-6 py-3"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded border border-input bg-background   text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 px-6 py-3"
          >
            Sign in
          </Link>
        </div>
      </section>


      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Everything you need</h2>
          <p className="mt-3 text-muted-foreground">
            Powerful features to help you get things done
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-md border border-border bg-card shadow-sm p-6 space-y-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Global search feature</h3>
          <p className="text-sm text-muted-foreground">
            Global search feature built for speed, reliability, and scale
          </p>
        </div>

        <div className="rounded-md border border-border bg-card shadow-sm p-6 space-y-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Secure login with email, social providers, and role-based access control
          </p>
        </div>

        <div className="rounded-md border border-border bg-card shadow-sm p-6 space-y-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Safe transactions</h3>
          <p className="text-sm text-muted-foreground">
            Safe transactions built for speed, reliability, and scale
          </p>
        </div>

        <div className="rounded-md border border-border bg-card shadow-sm p-6 space-y-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Own shop system</h3>
          <p className="text-sm text-muted-foreground">
            Own shop system built for speed, reliability, and scale
          </p>
        </div>

        <div className="rounded-md border border-border bg-card shadow-sm p-6 space-y-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Set your own prices</h3>
          <p className="text-sm text-muted-foreground">
            Set your own prices built for speed, reliability, and scale
          </p>
        </div>

        <div className="rounded-md border border-border bg-card shadow-sm p-6 space-y-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">No transaction fees</h3>
          <p className="text-sm text-muted-foreground">
            No transaction fees built for speed, reliability, and scale
          </p>
        </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-3 text-muted-foreground">
            Create your free account and start using PantyHub today.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded bg-primary   text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200 px-8 py-3"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} PantyHub</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-foreground transition-colors duration-200">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
