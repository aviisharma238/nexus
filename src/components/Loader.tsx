import React, { useState, useEffect } from 'react';

const NAMES: string[] = ['Collaboration', 'Promotion', 'Management', 'Participation', 'Interaction'];
const CYCLE_INTERVAL_MS = 500;
const TOTAL_CYCLE_DURATION_MS = NAMES.length * CYCLE_INTERVAL_MS;

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % NAMES.length;
        // When the cycle restarts (i.e., next index is 0), update the key
        // for the progress bar to force a re-render and restart its animation.
        if (nextIndex === 0) {
          setCycleKey((prevKey) => prevKey + 1);
        }
        return nextIndex;
      });
    }, CYCLE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const animationClass = currentIndex % 2 === 0
    ? 'animate-fade-in-out-left'
    : 'animate-fade-in-out-right';

  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen bg-black text-white antialiased overflow-hidden">
      <header className="absolute top-12 text-center">
        <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-gray-400">
          NEXUS
        </h1>
      </header>

      <div className="flex flex-col items-center justify-center">
        <div className="relative h-20 w-full flex items-center justify-center mb-6">
          <h2 key={currentIndex} className={`absolute text-3xl md:text-4xl font-semibold whitespace-nowrap ${animationClass}`}>
            {NAMES[currentIndex]}
          </h2>
        </div>
        
        <div className="w-56 md:w-72 bg-gray-800 h-1 rounded-full overflow-hidden">
          <div
            key={cycleKey}
            className="h-full bg-white rounded-full animate-progress-fill"
          ></div>
        </div>
      </div>
    </main>
  );
};

export default App;
