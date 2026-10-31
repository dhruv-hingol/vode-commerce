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
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ kind: "touch" | "pointer"; pointerId: number; x: number; y: number; radiansPerPixel: number; rotation: { x: number; y: number } } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const latestRotation = useRef(rotation);
  const reduced = useReducedMotion();
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const reset = () => setRotation({ x: 0, y: 0 });

  useEffect(() => { latestRotation.current = rotation; }, [rotation]);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    // Non-passive native touch listeners also work in mobile Safari and WebViews.
    function start(event: TouchEvent) {
      if (event.touches.length !== 1 || drag.current) return;
      event.preventDefault();
      const touch = event.touches[0];
      drag.current = { kind: "touch", pointerId: touch.identifier, x: touch.clientX, y: touch.clientY, radiansPerPixel: Math.PI * 2 / element!.clientWidth, rotation: { ...latestRotation.current } };
      setDragging(true);
    }
    function move(event: TouchEvent) {
      const active = drag.current;
      if (active?.kind !== "touch") return;
      const touch = Array.from(event.touches).find(item => item.identifier === active.pointerId);
      if (!touch) return;
      event.preventDefault();
      setRotation({ x: active.rotation.x + (touch.clientY - active.y) * active.radiansPerPixel, y: active.rotation.y + (touch.clientX - active.x) * active.radiansPerPixel });
    }
    function end(event: TouchEvent) {
      const active = drag.current;
      if (active?.kind !== "touch") return;
      if (Array.from(event.touches).some(touch => touch.identifier === active.pointerId)) return;
      drag.current = null;
      setDragging(false);
    }
    element.addEventListener("touchstart", start, { passive: false });
    element.addEventListener("touchmove", move, { passive: false });
    element.addEventListener("touchend", end);
    element.addEventListener("touchcancel", end);
    return () => {
      element.removeEventListener("touchstart", start);
      element.removeEventListener("touchmove", move);
      element.removeEventListener("touchend", end);
      element.removeEventListener("touchcancel", end);
    };
  }, []);

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
        ref={stage}
        className={`signature-stage ${dragging ? "is-dragging" : ""}`}
        role="group"
        aria-label="VODE wordmark. Drag or swipe to rotate, or use the arrow keys."
        tabIndex={0}
        onPointerDown={(event) => {
          if (event.pointerType === "touch" || event.button !== 0 || drag.current) return;
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { kind: "pointer", pointerId: event.pointerId, x: event.clientX, y: event.clientY, radiansPerPixel: Math.PI * 2 / event.currentTarget.clientWidth, rotation: { ...rotation } };
          setDragging(true);
        }}
        onPointerMove={(event) => {
          const active = drag.current;
          if (active?.kind !== "pointer" || active.pointerId !== event.pointerId) return;
          setRotation({
            x: active.rotation.x + (event.clientY - active.y) * active.radiansPerPixel,
            y: active.rotation.y + (event.clientX - active.x) * active.radiansPerPixel,
          });
        }}
        onPointerCancel={() => { if (drag.current?.kind === "pointer") { drag.current = null; setDragging(false); } }}
        onLostPointerCapture={() => { if (drag.current?.kind === "pointer") { drag.current = null; setDragging(false); } }}
        onPointerUp={(event) => {
          if (drag.current?.kind !== "pointer" || drag.current.pointerId !== event.pointerId) return;
          drag.current = null;
          setDragging(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onKeyDown={(event) => {
          const offsets: Record<string, { x: number; y: number }> = {
            ArrowLeft: { x: 0, y: -Math.PI / 12 },
            ArrowRight: { x: 0, y: Math.PI / 12 },
            ArrowUp: { x: -Math.PI / 12, y: 0 },
            ArrowDown: { x: Math.PI / 12, y: 0 },
          };
          const offset = offsets[event.key];
          if (offset) {
            event.preventDefault();
            setRotation((value) => ({
              x: value.x + offset.x,
              y: value.y + offset.y,
            }));
          }
          if (event.key === "Home" || event.key === "Escape") reset();
        }}
      >
        <span
          className={`footer-static-signature ${ready ? "is-hidden" : ""}`}
          style={{ transform: `rotateX(${rotation.x}rad) rotateY(${rotation.y}rad)` }}
          aria-hidden="true"
        >
          VODE
        </span>
        {mounted && !failed && (
          <SceneBoundary onFailure={onFailure}>
            <VodeScene
              visible={visible}
              dragging={dragging}
              rotation={rotation}
              immediate={Boolean(reduced) || !dragging}
              onReady={onReady}
              onFailure={onFailure}
            />
          </SceneBoundary>
        )}
      </div>
    </section>
  );
}
