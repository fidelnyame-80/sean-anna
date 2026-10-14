"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  target: string;
};

export default function Countdown({ target }: CountdownProps) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const targetTime = new Date(target).getTime();
    const update = () => {
      setRemaining(Math.max(0, Math.ceil((targetTime - Date.now()) / 1000)));
    };

    // Hydrate with the same placeholder as the static HTML, then use the clock.
    const initialTick = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);

    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, [target]);

  const units = [
    { label: "Days", value: remaining === null ? null : Math.floor(remaining / 86400) },
    { label: "Hours", value: remaining === null ? null : Math.floor((remaining % 86400) / 3600) },
    { label: "Minutes", value: remaining === null ? null : Math.floor((remaining % 3600) / 60) },
    { label: "Seconds", value: remaining === null ? null : remaining % 60 },
  ];

  return (
    <div className="countdown">
      <p className="countdown__caption" role="status">
        {remaining === 0 ? "The celebration begins" : "Until we say “I do”"}
      </p>
      <dl className="countdown__clock" role="timer" aria-label="Time until our wedding" aria-live="off">
        {units.map(({ label, value }) => (
          <div className="countdown__unit" key={label}>
            <dt className="countdown__label">{label}</dt>
            <dd className="countdown__number">
              {value === null ? "—" : String(value).padStart(2, "0")}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
