"use client";

import {
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import styles from "./icon-link.module.css";

type HomeIconLinkProps = {
  href: string;
  label: string;
  tooltipText?: string;
  tooltipTheme?: "inverse" | "current";
  children: ReactNode;
  className?: string;
  external?: boolean;
  accentHover?: boolean;
  size?: "default" | "large";
  social?: boolean;
};

export default function HomeIconLink({
  href,
  label,
  tooltipText = label,
  tooltipTheme = "inverse",
  children,
  className = "",
  external = false,
  accentHover = false,
  size = "default",
  social = false,
}: HomeIconLinkProps) {
  const [isMobileBalloonOpen, setIsMobileBalloonOpen] = useState(false);
  const hasRevealedBalloon = useRef(false);
  const lastPointerType = useRef<string | null>(null);
  function handlePointerDown(event: PointerEvent<HTMLAnchorElement>) {
    lastPointerType.current = event.pointerType;
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const isMobileTouch =
      lastPointerType.current === "touch" &&
      window.matchMedia("(max-width: 47.999rem)").matches;

    lastPointerType.current = null;

    if (!isMobileTouch) return;

    if (!hasRevealedBalloon.current) {
      event.preventDefault();
      hasRevealedBalloon.current = true;
      setIsMobileBalloonOpen(true);
      return;
    }

    hasRevealedBalloon.current = false;
    setIsMobileBalloonOpen(false);
  }

  function closeBalloon() {
    hasRevealedBalloon.current = false;
    setIsMobileBalloonOpen(false);
  }

  return (
    <span className={styles.wrapper}>
      <a
        href={href}
        aria-label={label}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onPointerDown={handlePointerDown}
        onPointerCancel={closeBalloon}
        onBlur={closeBalloon}
        onClick={handleClick}
        className={`${styles.link} ${size === "large" ? styles.large : ""} ${accentHover ? styles.accentHover : ""} ${social ? styles.social : ""} ${className}`}
      >
        {children}
      </a>
      <span
        aria-hidden="true"
        data-mobile-open={isMobileBalloonOpen || undefined}
        className={`${styles.tooltip} ${tooltipTheme === "current" ? styles.currentTooltip : styles.inverseTooltip}`}
      >
        <span className={`${styles.tooltipArrow} ${tooltipTheme === "current" ? styles.currentArrow : styles.inverseArrow}`} />
        {tooltipText}
      </span>
    </span>
  );
}
