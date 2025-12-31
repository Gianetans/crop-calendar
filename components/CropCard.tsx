'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import type { Crop, PlantingWindowStatus } from '@/types';

interface CropCardProps {
  crop: Crop;
  plantingWindow?: PlantingWindowStatus;
  onAddToGarden?: (crop: Crop) => void;
}

export default function CropCard({ crop, plantingWindow, onAddToGarden }: CropCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/crops/${crop.id}`);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToGarden) {
      onAddToGarden(crop);
    }
  };

  return (
    <Card onClick={handleCardClick} className="flex flex-col h-full">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
          <Badge type="category" value={crop.category} />
        </div>
        
        {crop.scientific_name && (
          <p className="text-sm text-gray-500 italic mb-3">{crop.scientific_name}</p>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Days to maturity:</span>
            <span className="font-medium">{crop.days_to_maturity} days</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Frost tolerance:</span>
            <Badge type="tolerance" value={crop.frost_tolerance} />
          </div>
          
          {plantingWindow && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Planting window:</span>
              <Badge type="window" value={plantingWindow} />
            </div>
          )}
        </div>
      </div>
      
      {onAddToGarden && (
        <Button 
          onClick={handleAddClick}
          variant="primary"
          size="sm"
          className="w-full"
        >
          Add to Garden
        </Button>
      )}
    </Card>
  );
}
