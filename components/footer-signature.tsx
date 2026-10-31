"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

const VodeScene = dynamic(() => import("./vode-scene"), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** A small, still signature rotated only by click-and-drag or the keyboard. */
export default function FooterSignature() {
  const host = useRef<HTMLElement>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number; rotation: { x: number; y: number } } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const reset = () => setRotation({ x: 0, y: 0 });

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={host}
      className="footer-signature"
      aria-label="Interactive VODE signature"
    >
      <div
        className={`signature-stage ${dragging ? "is-dragging" : ""}`}
        role="group"
        aria-label="VODE wordmark. Click and drag to rotate, or use the arrow keys."
        tabIndex={ready ? 0 : -1}
        onPointerDown={(event) => {
          if (!ready || event.button !== 0 || drag.current) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, rotation: { ...rotation } };
          setDragging(true);
        }}
        onPointerMove={(event) => {
          const active = drag.current;
          if (!active || active.pointerId !== event.pointerId) return;
          setRotation({
            x: Math.max(-Math.PI / 2, Math.min(Math.PI / 2, active.rotation.x + (event.clientY - active.y) * 0.012)),
            y: active.rotation.y + (event.clientX - active.x) * 0.012,
          });
        }}
        onPointerCancel={() => { drag.current = null; setDragging(false); }}
        onLostPointerCapture={() => { drag.current = null; setDragging(false); }}
        onPointerUp={(event) => {
          if (drag.current?.pointerId !== event.pointerId) return;
          drag.current = null;
          setDragging(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onKeyDown={(event) => {
          const offsets: Record<string, { x: number; y: number }> = {
            ArrowLeft: { x: 0, y: -0.15 },
            ArrowRight: { x: 0, y: 0.15 },
            ArrowUp: { x: -0.1, y: 0 },
            ArrowDown: { x: 0.1, y: 0 },
          };
          const offset = offsets[event.key];
          if (offset) {
            event.preventDefault();
            setRotation((value) => ({
              x: Math.max(-0.3, Math.min(0.3, value.x + offset.x)),
              y: value.y + offset.y,
            }));
          }
          if (event.key === "Home" || event.key === "Escape") reset();
        }}
      >
        <span
          className={`footer-static-signature ${ready ? "is-hidden" : ""}`}
          aria-hidden="true"
        >
          VODE
        </span>
        {mounted && !failed && (
          <SceneBoundary onFailure={onFailure}>
            <VodeScene
              visible={visible}
              rotation={rotation}
              immediate={Boolean(reduced) || !dragging}
              onReady={onReady}
            />
          </SceneBoundary>
        )}
      </div>
    </section>
  );
}
