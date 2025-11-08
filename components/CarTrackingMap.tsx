
import React, { useEffect, useState } from 'react';
import { CarIcon } from './icons/CarIcon';

interface CarTrackingMapProps {
  etaMinutes: number;
}

const CarTrackingMap: React.FC<CarTrackingMapProps> = ({ etaMinutes }) => {
  const [isMoving, setIsMoving] = useState(false);
  
  // Convert minutes to a reasonable animation duration in seconds.
  // Example: 1 min -> 10s, 5 mins -> 25s. Minimum 8s, max 45s.
  const animationDuration = Math.max(8, Math.min(etaMinutes * 5, 45));

  useEffect(() => {
    // Trigger animation shortly after mount to allow for initial render.
    const timer = setTimeout(() => setIsMoving(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Create an array for rendering parking lines
  const parkingLines = Array.from({ length: 4 });

  return (
    <div className="bg-gray-700/70 rounded-lg p-4 relative h-48 w-full overflow-hidden border border-gray-600">
      {/* Parking Lot Background Grid */}
      <div className="absolute inset-0 grid grid-cols-5 gap-2 p-4">
        {parkingLines.map((_, i) => (
          <div key={i} className="border-r border-dashed border-gray-500/50"></div>
        ))}
      </div>
      
      {/* Parking spaces */}
      <div className="absolute top-4 left-4 text-xs text-gray-400">Parking Bay P-3</div>
      <div className="absolute bottom-4 right-4 text-xs text-blue-300 font-semibold">Pickup Zone</div>
      <div className="absolute w-12 h-8 border-2 border-gray-500 rounded-sm top-[10%] left-[10%]"></div>


      {/* The moving car */}
      <div
        className="absolute transition-all"
        style={{
          top: isMoving ? '70%' : '10%',
          left: isMoving ? '80%' : '15%',
          transform: 'translate(-50%, -50%)',
          transitionProperty: 'top, left',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)', // ease-in-out
          transitionDuration: `${animationDuration}s`,
        }}
      >
        <div className={`transform ${isMoving ? 'rotate-[135deg]' : 'rotate-0'}`} style={{ transition: 'transform 1s' }}>
            <CarIcon className="w-10 h-10 text-blue-400" />
        </div>
      </div>
    </div>
  );
};

export default CarTrackingMap;
