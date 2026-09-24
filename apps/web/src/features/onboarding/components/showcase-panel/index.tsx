"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MacWindow } from "./mac-window";
import { WritingScene, SearchScene } from "./notes-scenes";

const scenes = [
  { key: "writing", title: "Notter — Product roadmap Q3", Component: WritingScene },
  { key: "search", title: "Notter — Search", Component: SearchScene },
] as const;

const HOLD_MS = 1400;

export function ShowcasePanel() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const holdTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(holdTimeout.current);
  }, []);

  function handleDone() {
    holdTimeout.current = window.setTimeout(() => {
      setSceneIndex((index) => (index + 1) % scenes.length);
    }, HOLD_MS);
  }

  const scene = scenes[sceneIndex];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 px-12 py-12">
      <div className="flex w-[560px] max-w-full flex-col gap-3 text-center">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-white">
          Write it once, find it forever
        </h2>
        <p className="text-base leading-relaxed text-white/60 text-pretty">
          Every note syncs instantly and stays searchable, so nothing you capture ever gets lost in the scroll.
        </p>
      </div>

      <div className="relative h-[440px] w-[560px] max-w-full">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={scene.key}
            className="absolute inset-0"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <MacWindow title={scene.title}>
              <scene.Component onDone={handleDone} />
            </MacWindow>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
