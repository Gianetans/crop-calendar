import React from 'react';
import type { FrostTolerance, CropCategory, PlantingWindowStatus, CropStatus } from '@/types';

interface BadgeProps {
  type: 'tolerance' | 'category' | 'window' | 'status';
  value: FrostTolerance | CropCategory | PlantingWindowStatus | CropStatus | string;
  className?: string;
}

export default function Badge({ type, value, className = '' }: BadgeProps) {
  const getStyles = () => {
    if (type === 'tolerance') {
      const toleranceStyles = {
        sensitive: 'bg-red-100 text-red-800',
        tolerant: 'bg-yellow-100 text-yellow-800',
        hardy: 'bg-blue-100 text-blue-800',
      };
      return toleranceStyles[value as FrostTolerance] || 'bg-gray-100 text-gray-800';
    }
    
    if (type === 'category') {
      const categoryStyles = {
        Vegetable: 'bg-green-100 text-green-800',
        Fruit: 'bg-pink-100 text-pink-800',
        Herb: 'bg-purple-100 text-purple-800',
        Grain: 'bg-amber-100 text-amber-800',
        Legume: 'bg-orange-100 text-orange-800',
      };
      return categoryStyles[value as CropCategory] || 'bg-gray-100 text-gray-800';
    }
    
    if (type === 'window') {
      const windowStyles = {
        'too-early': 'bg-gray-100 text-gray-800',
        'optimal': 'bg-green-100 text-green-800',
        'late': 'bg-orange-100 text-orange-800',
        'too-late': 'bg-red-100 text-red-800',
      };
      return windowStyles[value as PlantingWindowStatus] || 'bg-gray-100 text-gray-800';
    }
    
    if (type === 'status') {
      const statusStyles = {
        planned: 'bg-blue-100 text-blue-800',
        planted: 'bg-green-100 text-green-800',
        harvesting: 'bg-yellow-100 text-yellow-800',
        harvested: 'bg-gray-100 text-gray-800',
      };
      return statusStyles[value as CropStatus] || 'bg-gray-100 text-gray-800';
    }
    
    return 'bg-gray-100 text-gray-800';
  };
  
  const formatValue = () => {
    if (type === 'window') {
      const labels = {
        'too-early': 'Too Early',
        'optimal': 'Optimal',
        'late': 'Late',
        'too-late': 'Too Late',
      };
      return labels[value as PlantingWindowStatus] || value;
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyles()} ${className}`}>
      {formatValue()}
    </span>
  );
}
