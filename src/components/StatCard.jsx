import React from "react";
import { calculatePercentage } from "../utils/calculateProgress";

const StatCard = ({ title, value, goal, unit = "" }) => {
  const percentage = calculatePercentage(value, goal);

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-gray-500 font-medium mb-2">{title}</h3>
      
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className="text-sm text-gray-400">/ {goal} {unit}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-1000 ${
            percentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-right">{percentage}%</p>
    </div>
  );
};

export default StatCard;