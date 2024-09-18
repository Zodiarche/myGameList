import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <div id="loading" className="loading">
        <p className="loading__text">Chargement{dots}</p>
      </div>
    </main>
  );
};

export default Loading;
