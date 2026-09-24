"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface TypedTextProps {
  text: string;
  /** ms per character */
  speed?: number;
  onDone?: () => void;
}

/** Mount this component to start typing; unmount it to stop. */
export function TypedText({ text, speed = 28, onDone }: TypedTextProps) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(() => (reduceMotion ? text : ""));

  useEffect(() => {
    if (reduceMotion) {
      const timeout = window.setTimeout(() => onDone?.(), 400);
      return () => window.clearTimeout(timeout);
    }

    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      setShown(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, reduceMotion]);

  return (
    <span>
      {shown}
      {!reduceMotion && shown.length < text.length ? (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-current" />
      ) : null}
    </span>
  );
}
