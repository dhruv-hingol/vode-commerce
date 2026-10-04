import type { SVGProps } from "react";

export function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 7h14l1 14H4L5 7Z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </svg>
  );
}
export function WhatsAppIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M20 11.6a8 8 0 0 1-11.7 7.1L4 20l1.3-4.3A8 8 0 1 1 20 11.6Z" />
      <path d="M8.2 7.5c-.8 3.5 2.8 7.1 6.3 6.3l1-1.5-2-1-1 .8a7 7 0 0 1-2.5-2.5l.8-1-1-2-1.6.9Z" />
    </svg>
  );
}
