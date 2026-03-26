import { type FC, useEffect, useState, useRef } from 'react';

interface Props {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: FC<Props> = ({
  value,
  duration = 1000,
  suffix = '',
  className = '',
}) => {
  const [count, setCount]   = useState(0);
  const startTime           = useRef<number | null>(null);
  const frameRef            = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed  = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {count}{suffix}
    </span>
  );
};