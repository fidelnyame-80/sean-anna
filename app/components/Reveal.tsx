"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
};

export default function Reveal({ children, className, delay }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const show = () => {
      element.classList.remove("reveal--pending");
      element.classList.add("reveal--visible");
    };

    const motionPreference = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    );

    if (motionPreference?.matches || !("IntersectionObserver" in window)) {
      show();
      return;
    }

    // Content starts visible in the server HTML. Only hide sections that are
    // still below the viewport when JavaScript is ready.
    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.9) {
      show();
      return;
    }

    let disposed = false;
    element.classList.add("reveal--pending");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!disposed && entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    const handleMotionPreference = () => {
      if (motionPreference?.matches) {
        observer.disconnect();
        show();
      }
    };

    motionPreference?.addEventListener("change", handleMotionPreference);
    observer.observe(element);

    return () => {
      disposed = true;
      observer.disconnect();
      motionPreference?.removeEventListener("change", handleMotionPreference);
      element.classList.remove("reveal--pending");
    };
  }, []);

  const classes = ["reveal", className].filter(Boolean).join(" ");
  const style =
    delay === undefined
      ? undefined
      : ({ "--reveal-delay": `${Math.max(0, delay)}ms` } as CSSProperties);

  return (
    <div ref={elementRef} className={classes} style={style}>
      {children}
    </div>
  );
}
