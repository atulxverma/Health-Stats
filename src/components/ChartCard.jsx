import React from "react";

const ChartCard = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
      </div>
      <div className="w-full h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;