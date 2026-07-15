import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl sm:text-5xl md:text-6xl",
  };

  return (
    <div className={cn("font-heading font-semibold tracking-wide", sizes[size], className)}>
      <span className="text-brand">Randhawa</span>{" "}
      <span className="text-foreground">Dental</span>
    </div>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="inline-flex size-8 items-center justify-center rounded-md bg-brand text-sm font-heading font-bold text-brand-foreground"
      >
        RD
      </span>
      <div className="leading-tight">
        <p className="font-heading text-base font-semibold tracking-wide">
          <span className="text-brand">Randhawa</span> Dental
        </p>
        <p className="text-[11px] text-muted-foreground">New Patient Intake</p>
      </div>
    </div>
  );
}
