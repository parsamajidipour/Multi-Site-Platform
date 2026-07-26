import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FROM = {
  up:    { opacity: 0, y: 48 },
  down:  { opacity: 0, y: -32 },
  left:  { opacity: 0, x: -36 },
  right: { opacity: 0, x: 36 },
  scale: { opacity: 0, scale: 0.84, y: 18 },
  fade:  { opacity: 0 },
  pop:   { opacity: 0, scale: 0.68 },
};
const TO = {
  up:    { opacity: 1, y: 0 },
  down:  { opacity: 1, y: 0 },
  left:  { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1, y: 0 },
  fade:  { opacity: 1 },
  pop:   { opacity: 1, scale: 1 },
};

const SCRUB_FROM = Object.fromEntries(
  Object.entries(FROM).map(([key, value]) => [key, { ...value, opacity: 1 }])
);

/* Trigger-once reveal */
export function Reveal({ children, delay = 0, className = "", from = "up" }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, TO[from] ?? TO.up);
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.set(el, FROM[from] ?? FROM.up);
      gsap.to(el, {
        ...(TO[from] ?? TO.up),
        duration: 0.82,
        delay,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => ctx.revert();
  }, [delay, from]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* Scrub reveal — animation tied to scroll position, not trigger-once */
export function RevealScrub({ children, from = "up", className = "" }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, TO[from] ?? TO.up);
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        SCRUB_FROM[from] ?? SCRUB_FROM.up,
        {
          ...(TO[from] ?? TO.up),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "top 48%",
            scrub: 0.8,
          },
        }
      );
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => ctx.revert();
  }, [from]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* Parallax — element moves at a different speed than scroll */
export function Parallax({ children, speed = -0.2, className = "" }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") || el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => ctx.revert();
  }, [speed]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* Stagger group — trigger-once, children animate sequentially */
export function RevealStagger({ children, className = "", staggerChildren = 0.09, from = "up" }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.children);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(items, TO[from] ?? TO.up);
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.set(items, FROM[from] ?? FROM.up);
      gsap.to(items, {
        ...(TO[from] ?? TO.up),
        duration: 0.68,
        ease: "expo.out",
        stagger: staggerChildren,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => ctx.revert();
  }, [staggerChildren, from]);
  return <div ref={ref} className={className}>{children}</div>;
}

export function RevealItem({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
