'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
  startTime: number;
}

export default function Timer({ startTime }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  const seconds = (elapsed / 1000).toFixed(1);

  return (
    <div className="text-lg font-mono text-gray-700">
      {seconds}s
    </div>
  );
}
