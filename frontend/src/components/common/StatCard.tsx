import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  bgColor: string;
  iconColor: string;
  icon: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeColor,
  bgColor,
  iconColor,
  icon,
  description = "from last month"
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <span className={`text-xl ${iconColor}`}>
            {icon}
          </span>
        </div>
        <div className="text-right">
          <span className={`text-sm font-medium ${changeColor} bg-opacity-20 px-2 py-1 rounded-full ${changeColor === 'text-green-600' ? 'bg-green-50' : changeColor === 'text-red-600' ? 'bg-red-50' : 'bg-yellow-50'}`}>
            {change}
          </span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <div className="flex items-center">
        <span className="text-xs text-gray-500">
          {description}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
