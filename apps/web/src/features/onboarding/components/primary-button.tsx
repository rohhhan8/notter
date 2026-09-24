import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PrimaryButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "h-11 w-full text-base font-semibold transition-transform duration-100 ease-out active:scale-[0.98]",
        className
      )}
      {...props}
    />
  );
}
