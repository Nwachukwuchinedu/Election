import React from 'react';

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    info: 'bg-info-100 text-info-600',
    warning: 'bg-warning-100 text-warning-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {Icon && <Icon className="h-8 w-8" />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;