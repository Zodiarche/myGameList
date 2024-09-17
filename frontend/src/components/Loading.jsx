import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <p className="loading-text">Chargement{dots}</p>
    </div>
  );
};

export default Loading;
