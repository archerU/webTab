import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="flex flex-col items-center justify-center text-white select-none drop-shadow-lg">
      <h1 className="text-8xl font-light tracking-tighter mb-2">
        {formatTime(time)}
      </h1>
      <p className="text-xl font-medium opacity-90 tracking-wide">
        {formatDate(time)}
      </p>
    </div>
  );
};

export default Clock;