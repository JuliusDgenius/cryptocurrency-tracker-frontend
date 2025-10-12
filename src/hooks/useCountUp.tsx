import { useState, useRef, useCallback } from 'react';

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// Custom hook for the count-up animation
export const useCountUp = (endValue: number, duration: number = 1500) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    const animate = useCallback(() => {
      let start: number = Math.floor(endValue * 0.6);
      const range = endValue - start;

      // Cap duration for very large numbers
      const capDuration = Math.min(duration, range > 10000 ? 2000 : duration);
      const startTime = Date.now();


      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / capDuration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentVal = Math.floor(start + easedProgress * range);

        setCount(currentVal);

        if (easedProgress < 1) {
            requestAnimationFrame(step);
        } else {
          // Ensure the final value is always exact
          setCount(endValue);
        }
      };
      requestAnimationFrame(step);
    }, [endValue, duration]);

    return { count, animate, ref };
};