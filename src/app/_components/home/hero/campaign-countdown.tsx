"use client";

import { useEffect, useState } from "react";
import type { CountdownCopy } from "./types";
import styles from "./hero.module.css";

type CountdownProps = { endsAt: string; copy: CountdownCopy };
type RemainingTime = { days: number; hours: number; minutes: number; seconds: number };

function getRemainingTime(milliseconds: number): RemainingTime {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function CampaignCountdown({ endsAt, copy }: CountdownProps) {
  const deadline = Date.parse(endsAt);
  const [remainingTime, setRemainingTime] = useState<RemainingTime | null>(null);

  useEffect(() => {
    if (!Number.isFinite(deadline)) return;

    const updateRemainingTime = () => {
      setRemainingTime(getRemainingTime(Math.max(0, deadline - Date.now())));
    };

    updateRemainingTime();
    const intervalId = window.setInterval(updateRemainingTime, 1000);
    return () => window.clearInterval(intervalId);
  }, [deadline]);

  const hasEnded = remainingTime !== null && Object.values(remainingTime).every((value) => value === 0);

  return (
    <div className={styles.countdown}>
      {remainingTime === null ? null : hasEnded ? (
        <section aria-labelledby="campaign-countdown-title" className={styles.endedPanel}>
          <h2 id="campaign-countdown-title" className={styles.endedTitle}>
            {copy.ended}
          </h2>
        </section>
      ) : (
        <section aria-labelledby="campaign-countdown-title" className={styles.timerPanel}>
          <h2 id="campaign-countdown-title" className={styles.timerTitle}>
            {copy.title}
          </h2>
          <div
            role="timer"
            aria-label={`${remainingTime.days} ${copy.days}, ${remainingTime.hours} ${copy.hours}, ${remainingTime.minutes} ${copy.minutes}, ${remainingTime.seconds} ${copy.seconds}`}
            className={styles.timer}
          >
            {[
              { value: remainingTime.days, label: copy.days },
              { value: remainingTime.hours, label: copy.hours },
              { value: remainingTime.minutes, label: copy.minutes },
              { value: remainingTime.seconds, label: copy.seconds },
            ].map((unit, index) => (
              <span key={unit.label} className={styles.unitLayout}>
                <span className={styles.unit}>
                  <span className={styles.value}>{String(unit.value).padStart(2, "0")}</span>
                  <span className={styles.unitLabel}>{unit.label}</span>
                </span>
                {index < 3 ? (
                  <span aria-hidden="true" className={styles.separator}>
                    :
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
