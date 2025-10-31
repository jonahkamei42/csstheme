import React, { useRef, useState } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { CanvasElement } from './CanvasElement';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';

export const Canvas: React.FC = () => {
  const { elements, addElement, setSelectedId, selectedId, deleteElement } = useBuilderStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addElement(type as any, { x, y });
  };

  const topLevelElements = Object.values(elements).filter(el => !el.parentId);

  return (
    <div className="flex-1 flex flex-col bg-gray-200">
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <h2 className="text-lg font-semibold">Canvas</h2>
        {selectedId && (
          <button
            onClick={() => deleteElement(selectedId)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 text-sm"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>
      
      <div
        ref={canvasRef}
        className={clsx('flex-1 overflow-auto relative canvas-grid', isDraggingOver && 'outline-2 outline-dashed outline-blue-500')}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedId(null);
          }
        }}
      >
        <div className="min-h-full min-w-full relative p-4">
          {topLevelElements.map((element) => (
            <CanvasElement key={element.id} id={element.id} />
          ))}
          
          {topLevelElements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
              <p className="text-center bg-white/50 backdrop-blur-sm p-4 rounded-lg">
                Drag components from the left panel to start building
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
