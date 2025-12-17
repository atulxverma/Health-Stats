import React from 'react';

const WaterTracker = ({ current, goal, onAdd }) => {
  const fillHeight = Math.min((current / goal) * 100, 100);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">Hydration</h3>
      
      {/* Visual Cup */}
      <div className="relative w-24 h-32 bg-gray-100 rounded-b-xl border-4 border-gray-200 overflow-hidden mb-4">
        <div 
          className="absolute bottom-0 left-0 w-full bg-blue-400 transition-all duration-500 opacity-80"
          style={{ height: `${fillHeight}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-700 z-10">
           {Math.round((current/goal)*100)}%
        </div>
      </div>

      <p className="text-xl font-bold text-gray-800 mb-2">{current} <span className="text-sm text-gray-500">/ {goal} ml</span></p>
      
      <div className="flex gap-2">
        <button onClick={() => onAdd(200)} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200">+200ml</button>
        <button onClick={() => onAdd(500)} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200">+500ml</button>
      </div>
    </div>
  );
};

export default WaterTracker;