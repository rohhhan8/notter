"use client";

import { motion, useReducedMotion } from "motion/react";
import { stepperTotal } from "@/features/onboarding/steps";

const stepLabels = ["Account", "Profile"] as const;

interface OnboardingStepperProps {
  /** 1-indexed current step */
  current: 1 | 2;
}

export function OnboardingStepper({ current }: OnboardingStepperProps) {
  const reduceMotion = useReducedMotion();
  const progress = current / stepperTotal;

  return (
    <div className="flex flex-col gap-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        Step {current} of {stepperTotal} · {stepLabels[current - 1]}
      </span>
    </div>
  );
}
