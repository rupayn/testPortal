import { Button } from "@/components/ui/button";
import { useState } from "react";

function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-foreground">
      {/* Faint grid background */}
      <div
        className="pointer-events-none absolute inset-0 text-foreground opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        {/* Status pill */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 font-mono text-xs text-foreground">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Backend in development
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Something is
          <br />
          being built here
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-xl text-balance text-base text-muted-foreground">
          The backend is still under construction. Once it&apos;s ready, the full frontend will be
          wired up. In the meantime, feel free to play with the counter below.
        </p>

        {/* Counter card */}
        <div className="mt-12 w-full rounded-2xl border border-border bg-card px-10 py-12 shadow-sm">
          <p className="text-6xl font-bold tabular-nums text-card-foreground">{count}</p>

          <Button onClick={() => setCount((count) => count + 1)} className="mt-8 w-full max-w-xs">
            Increment
          </Button>

          {/* Helper text */}
          <p className="mt-6 font-mono text-xs text-muted-foreground">
            a little something to click while you wait
          </p>
        </div>

        {/* Footer status */}
        <p className="mt-10 font-mono text-xs text-muted-foreground">Status: shipping soon</p>
      </div>
    </main>
  );
}

export default Home;
