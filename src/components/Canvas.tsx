import React, { useState } from 'react';
import { ElementData } from '../types';
import { CanvasElement } from './CanvasElement';
import { Trash2 } from 'lucide-react';

interface CanvasProps {
  elements: ElementData[];
  onDrop: (x: number, y: number) => void;
  onUpdateElement: (id: string, updates: Partial<ElementData>) => void;
  onDeleteElement: (id: string) => void;
  selectedId: string | null;
  onSelectElement: (id: string | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  onDrop,
  onUpdateElement,
  onDeleteElement,
  selectedId,
  onSelectElement
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onDrop(x, y);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Canvas</h2>
        {selectedId && (
          <button
            onClick={() => {
              onDeleteElement(selectedId);
              onSelectElement(null);
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 text-sm"
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
        )}
      </div>
      
      <div
        className={`flex-1 overflow-auto relative ${isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onSelectElement(null);
          }
        }}
      >
        <div className="min-h-full min-w-full relative p-4">
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedId === element.id}
              onUpdate={onUpdateElement}
              onSelect={onSelectElement}
            />
          ))}
          
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <p className="text-center">
                Drag components from the left panel to start building
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
