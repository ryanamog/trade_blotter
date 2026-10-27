import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });

  return (
    
    <div className="d-flex align-items-center gap-2 font-mono text-secondary small" style={{ fontSize: '0.72rem' }}>
        <span className="live-dot" />
        <span className="text-success fw-semibold">LIVE</span>
        <span>&middot;</span>  
        <span>{formatTime(time)} {formatDate(time)}</span>
    </div>
  );
}
