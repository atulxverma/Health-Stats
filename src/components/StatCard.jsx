import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, unit, icon: Icon, color, trend }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl text-white shadow-md ${color}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
          <span className="text-sm font-medium text-slate-400">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;