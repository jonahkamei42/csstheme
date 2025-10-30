import React, { useState, useRef } from 'react';
import { ElementData } from '../types';

interface CanvasElementProps {
  element: ElementData;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<ElementData>) => void;
  onSelect: (id: string | null) => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onUpdate,
  onSelect
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }
    
    e.stopPropagation();
    onSelect(element.id);
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: element.x,
      elementY: element.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      onUpdate(element.id, {
        x: dragStartPos.current.elementX + dx,
        y: dragStartPos.current.elementY + dy
      });
    } else if (isResizing) {
      const dx = e.clientX - resizeStartPos.current.x;
      const dy = e.clientY - resizeStartPos.current.y;
      onUpdate(element.id, {
        width: Math.max(50, resizeStartPos.current.width + dx),
        height: Math.max(30, resizeStartPos.current.height + dy)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height
    };
  };

  const getElementLabel = () => {
    return element.type.charAt(0).toUpperCase() + element.type.slice(1);
  };

  return (
    <div
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        ...element.styles
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="w-full h-full flex items-center justify-center text-gray-700 font-medium text-sm">
        {getElementLabel()}
      </div>
      
      {isSelected && (
        <div
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};
