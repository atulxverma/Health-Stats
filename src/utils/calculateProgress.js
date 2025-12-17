export const calculatePercentage = (current, goal) => {
  if (!goal || goal === 0) return 0;
  const percentage = Math.round((current / goal) * 100);
  return Math.min(percentage, 100);
};

export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return 0;
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
};