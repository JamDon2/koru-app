import { cn } from "@/lib/utils";
import Image from "next/image";

interface MerchantLogoProps {
  merchantName: string;
  className?: string;
  logoUrl?: string;
}

export function MerchantLogo({
  merchantName,
  logoUrl,
  className,
}: MerchantLogoProps) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={merchantName}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full"
      />
    );
  }

  const firstLetter = merchantName?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={cn(
        "bg-muted/20 text-muted-foreground border-border/50 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium",
        className
      )}
    >
      {firstLetter}
    </div>
  );
}
