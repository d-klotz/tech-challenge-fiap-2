'use client'

import { useEffect, useState } from 'react';
import { CropOption } from '../lib/farmPlotAllocation';

interface GAVisualizerProps {
  isProcessing: boolean;
  currentAllocation: {
    crop1: CropOption | null;
    crop1_acres: number;
    crop2: CropOption | null;
    crop2_acres: number;
  } | null;
}

const cropColors: { [key: string]: string } = {
  "Corn": "#F7DC6F",
  "Soybeans": "#82E0AA",
  "Rice": "#F8C471",
  "Potatoes": "#E59866",
  "Tomatoes": "#EC7063",
  "Carrots": "#E67E22",
  "Cucumbers": "#52BE80",
  "Peppers": "#E74C3C",
  "Onions": "#D7BDE2",
  "Wheat": "#DAA520"
};

export default function GAVisualizer({ isProcessing, currentAllocation }: GAVisualizerProps) {
  const [squares, setSquares] = useState<string[]>(Array(10).fill('bg-gray-200'));

  useEffect(() => {
    if (!isProcessing || !currentAllocation) {
      setSquares(Array(10).fill('bg-gray-200'));
      return;
    }

    const newSquares = Array(10).fill('bg-gray-200');
    const { crop1, crop1_acres, crop2 } = currentAllocation;

    if (crop1) {
      const color1 = cropColors[crop1.name];
      for (let i = 0; i < crop1_acres; i++) {
        newSquares[i] = color1;
      }
    }

    if (crop2) {
      const color2 = cropColors[crop2.name];
      for (let i = crop1_acres; i < crop1_acres + currentAllocation.crop2_acres; i++) {
        newSquares[i] = color2;
      }
    }

    setSquares(newSquares);
  }, [isProcessing, currentAllocation]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Land Allocation Visualization</h3>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {squares.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded transition-colors duration-200"
            style={{ backgroundColor: color.startsWith('#') ? color : '' }}
          />
        ))}
      </div>
      <div className="space-y-2">
        {Object.entries(cropColors).map(([cropName, color]) => (
          <div key={cropName} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-600">{cropName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
